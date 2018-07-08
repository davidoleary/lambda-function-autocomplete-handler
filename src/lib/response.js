import { v4 } from 'uuid';

/**
 * Handle API Responses
 */
class Response {
  /**
   * Set head content
   * @param head
   * @returns {Response}
   */
  setHead(head) {
    this.head = head;
    return this;
  }

  setContent(content) {
    this.content = content;
    return this;
  }

  getResponse() {
    return {
      head: {
        ...this.head,
      },
      content: {
        ...this.content,
      },
    };
  }
}

/**
 * Handle error responses
 */
class ErrorResponse extends Response {
  constructor(message, code) {
    super();
    this.setError(message, code);
  }

  /**
   * Set error
   * @param message
   * @param code
   * @returns {ErrorResponse}
   */
  setError(message, code) {
    this.setContent({
      error: {
        message,
        code,
        uuid: v4(),
      },
    });
    return this;
  }

  /**
   * Set detailed secondary errors.
   * @param error
   * @returns {ErrorResponse}
   */
  setErrors(error) {
    if (!Object.prototype.hasOwnProperty.call(this.content.error, 'errors')) {
      this.content.error.errors = [];
    }
    this.content.error.errors = this.content.error.errors.concat(error);
    return this;
  }

  /**
   * Response format
   * @returns {{head: {}, content: {}}}
   */
  getResponse() {
    return {
      head: {
        ...this.head,
      },
      content: {
        ...this.content,
      },
    };
  }
}

export { Response, ErrorResponse };
