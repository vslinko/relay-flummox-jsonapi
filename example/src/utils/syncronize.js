function createLock() {
  const lock = {};
  const fn = {};

  lock.unlocked = false;
  lock.canceled = false;
  lock.stopped = false;

  lock.unlock = () => {
    if (lock.unlocked) throw new Error();
    lock.unlocked = true;
    fn.resolve({canceled: lock.canceled || lock.stopped});
  };

  lock.cancel = () => {
    if (lock.unlocked) throw new Error();
    lock.canceled = true;
  };

  lock.stop = () => {
    if (lock.unlocked) throw new Error();
    lock.stopped = true;
  };

  lock.promise = new Promise(function(resolve, reject) {
    fn.resolve = resolve;
    fn.reject = reject;
  });

  return lock;
}

const queues = {};
const processed = {};

export default function syncronize({limit = -1, queueKey, onQueueStart, onQueueEnd}) {
  return function syncronize(obj, prop, descriptor) {
    const method = descriptor.value;

    async function processQueue(context, args) {
      const key = queueKey(...args);
      if (!queues[key]) {
        queues[key] = [];
      }

      const lock = createLock();
      args.push(lock.promise);

      if (processed[key]) {
        if (limit === 0) {
          lock.cancel();
        } else {
          queues[key].push(lock);
          if (limit > 0 && queues[key].length > limit) {
            queues[key][queues[key].length - limit - 1].cancel();
          }
        }
      } else {
        lock.unlock();
      }

      processed[key] = true;
      if (onQueueStart) onQueueStart.call(context, key);

      let error, response;
      try {
        response = await method.apply(context, args);
      } catch (e) {
        error = e;
      }

      if (queues[key].length > 0) {
        const nextLock = queues[key].shift();
        if (error || lock.stopped) {
          nextLock.stop();
        }
        nextLock.unlock();
      } else {
        processed[key] = false;
        if (onQueueEnd) onQueueEnd.call(context, key);
      }

      if (error) {
        throw error;
      } else {
        return response;
      }
    }

    descriptor.value = function (...args) {
      return processQueue(this, args);
    };

    return descriptor;
  };
}
