class SearchModel {
  constructor(client) {
    this.client = client;

    this.client.on('error', (err) => {
      throw new Error(err);
    });
  }

  /**
   * Get all available keys
   * @return {Promise}
   */
  getAllKeys() {
    return new Promise((resolve, reject) => {
      this.client.keys('*', (err, reply) => {
        if (err) {
          reject(err);
        }

        resolve(reply);
      });
    });
  }

  /**
   * Designers
   * Categories
   * Popular Search
   * Just in
   *
   * @param {Array} keys
   * @returns {Promise}
   */
  getMultiple(keys) {
    if (!Array.isArray(keys)) {
      throw new Error('Keys param must be a valid array');
    }

    const client = this.client;
    const multi = client.multi();

    keys.map(key => multi.lrange(key.name, 0, -1));

    return new Promise((resolve, reject) => {
      multi.exec((err, replies) => {
        if (err) {
          reject(err);
        }

        const data = replies.map((reply, index) => {
          if (keys[index].parser) {
            return keys[index].parser(reply);
          }
          return reply;
        });

        resolve(data);
      });
    });
  }
}

export default SearchModel;
