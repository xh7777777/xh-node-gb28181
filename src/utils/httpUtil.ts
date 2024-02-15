class Resolve {
    success(msg = "success", errorCode = 1, code = 200) {
      return {
        msg,
        errorCode,
        code,
      };
    }
    fail(msg = "error", errorCode = 0, code = 404) {
      return {
        msg,
        errorCode,
        code,
      };
    }
    json(data:any, msg = "success", errorCode = 1, code = 200) {
      return {
        msg,
        errorCode,
        code,
        data,
      };
    }
  }
export const resolve = new Resolve();