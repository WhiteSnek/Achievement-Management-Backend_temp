class CrudRepo {
  constructor(model) {
    this.model = model;
  }

  create = async (data) => {
    try {
      const doc = await this.model.create(data);
      return doc;
    } catch (error) {
      console.log("CRUD error: " + error);
      throw error;
    }
  };

  getAll = async () => {
    try {
      const docs = await this.model.findAll();
      return docs;
    } catch (error) {
      console.log("CRUD error: " + error);
      throw error;
    }
  };

  getOne = async (id) => {
    try {
      const doc = await this.model.findByPk(id);
      return doc;
    } catch (error) {
      console.log("CRUD error: " + error);
      throw error;
    }
  };

  destroy = async (id) => {
    try {
      const result = await this.model.destroy({
        where: { id }
      });

      if (result === 0) {
        throw new Error('Record not found');
      }

      return result;
    } catch (error) {
      console.log("CRUD error: " + error);
      throw error;
    }
  };
}

module.exports = CrudRepo;
