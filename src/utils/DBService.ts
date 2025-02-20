import { Model, HydratedDocument, ClientSession } from "mongoose";

class DBService<T> {
  private readonly fields: string[];
  private readonly Model: Model<T>;

  constructor(Model: Model<T>, populatedPaths: string[]) {
    this.Model = Model;
    this.fields = populatedPaths;
  }

  public saveMany(data: any[], session: ClientSession): Promise<any> {
    return this.Model.insertMany(data, { session: session });
  }

  public save(data: any, session: ClientSession | null = null): Promise<any> {
    const model = new this.Model(data);
    return model.save({ session: session });
  }

  public create(data: any, session = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.Model.create(data)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public count(query = {}): Promise<number> {
    return new Promise((resolve, reject) => {
      this.Model.countDocuments(query)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  public find(
    query: any = {},
    sort = null,
    limit = 300,
    session = null,
    selectedFields = [],
    populatedFields = [],
  ): Promise<HydratedDocument<T>[]> {
    const populate = populatedFields.length > 0 ? populatedFields : this.fields;
    return new Promise((resolve, reject) => {
      this.Model.find(query)
        .populate(populate)
        .session(session)
        .limit(limit)
        .sort(sort || { created_at: -1 })
        .select(selectedFields)
        .then((data: HydratedDocument<any>[]) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  public findAll(
    query: any = {},
    sort = null,
    selectedFields = [],
    populatedFields = [],
  ): Promise<HydratedDocument<T>[]> {
    const populate = populatedFields.length > 0 ? populatedFields : this.fields;
    return new Promise((resolve, reject) => {
      this.Model.find(query)
        .populate(populate)
        .sort(sort || { created_at: -1 })
        .select(selectedFields)
        .then((data: HydratedDocument<T>[]) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  public findWithPopulate(
    query: any,
    sort = null,
    limit = 300,
    session: ClientSession,
    selectedFields = [],
    populatedFields = [],
  ): Promise<HydratedDocument<T>[]> {
    const populate = populatedFields.length > 0 ? populatedFields : this.fields;
    return new Promise((resolve, reject) => {
      this.Model.find(query)
        .session(session)
        .limit(limit)
        .populate(populate)
        .sort(sort || { created_at: -1 })
        .select(selectedFields)
        .then((data: any) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  public paginate(
    query: any = {},
    limit = 10,
    page = 1,
    selectedFields = [],
    sort: Record<string, number | string> = { created_at: -1 },
  ): Promise<HydratedDocument<T>[]> {
    const customLabels = {
      totalDocs: "itemsCount",
      docs: "data",
      limit: "perPage",
      page: "currentPage",
      nextPage: "next",
      prevPage: "prev",
      totalPages: "pageCount",
      pagingCounter: "serialNumber",
      meta: "paginator",
    };

    const options = {
      page: page,
      limit: limit,
      customLabels: customLabels,
      select: selectedFields,
      sort: sort,
    };

    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.Model.paginate(query, options)
        .then((data: any) => {
          resolve(data);
        })
        .catch((e: Error) => {
          reject(e);
        });
    });
  }

  public paginateWithPopulate(
    query: any,
    limit = 10,
    sort = null,
    page = 1,
    selectedFields = [],
    populatedFields = [],
  ): Promise<HydratedDocument<T>[]> {
    const populate = populatedFields.length > 0 ? populatedFields : this.fields;
    const customLabels = {
      totalDocs: "itemsCount",
      docs: "data",
      limit: "perPage",
      page: "currentPage",
      nextPage: "next",
      prevPage: "prev",
      totalPages: "pageCount",
      pagingCounter: "serialNumber",
      meta: "paginator",
    };

    const options = {
      page: page,
      limit: limit,
      sort: sort || { created_at: -1 },
      customLabels: customLabels,
      populate: populate,
      select: selectedFields,
    };

    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.Model.paginate(query, options)
        .then((data: any) => {
          resolve(data);
        })
        .catch((e: Error) => {
          reject(e);
        });
    });
  }

  public findById(
    id: string,
    session = null,
    selectedFields = [],
  ): Promise<HydratedDocument<T>> {
    return new Promise((resolve, reject) => {
      this.Model.findById(id)
        .session(session)
        .select(selectedFields)
        .then((data: any) => {
          resolve(data);
        })
        .catch((e: Error) => {
          reject(e);
        });
    });
  }

  public findByIdWithPopulate(
    id: string,
    session: ClientSession,
    selectedFields = [],
    populatedFields = [],
  ): Promise<HydratedDocument<T>[]> {
    const populate = populatedFields.length > 0 ? populatedFields : this.fields;
    return new Promise((resolve, reject) => {
      this.Model.findById(id)
        .session(session)
        .populate(populate)
        .select(selectedFields)
        .session(session)
        .then((data: any) => {
          resolve(data);
        })
        .catch((e: Error) => {
          reject(e);
        });
    });
  }

  public findOne(
    query: any,
    session = null,
    selectedFields = [],
  ): Promise<HydratedDocument<T>> {
    return new Promise((resolve, reject) => {
      const populate = this.fields;
      this.Model.findOne(query)
        .select(selectedFields)
        .populate(populate)
        .session(session)
        .then((data: any) => {
          resolve(data);
        })
        .catch((e: Error) => {
          reject(e);
        });
    });
  }

  public findOneWithPopulate(
    query: any,
    session: ClientSession,
    selectedFields = [],
    populatedFields = [],
  ): Promise<HydratedDocument<T>> {
    const populate = populatedFields.length > 0 ? populatedFields : this.fields;
    return new Promise((resolve, reject) => {
      this.Model.findOne(query)
        .populate(populate)
        .select(selectedFields)
        .session(session)
        .then((data: any) => {
          resolve(data);
        })
        .catch((e: Error) => {
          reject(e);
        });
    });
  }

  public update(id: string, data: any, session = null): Promise<any> {
    return this.Model.findByIdAndUpdate(id, data, { new: true })
      .session(session)
      .exec();
  }

  public updateOne(
    query: any,
    data: any,
    session: ClientSession | null = null,
  ): Promise<any> {
    return this.Model.findOneAndUpdate(query, data, { new: true })
      .session(session)
      .exec();
  }

  public updateMany(
    query: any,
    data: any,
    session: ClientSession | null = null,
  ): Promise<any> {
    return this.Model.updateMany(query, data).session(session).exec();
  }

  public DeleteOne(
    query: any,
    session: ClientSession | null = null,
  ): Promise<any> {
    return this.Model.findOneAndDelete(query).session(session).exec();
  }

  public DeleteMany(
    query: any,
    session: ClientSession | null = null,
  ): Promise<any> {
    return this.Model.deleteMany(query).session(session).exec();
  }
}

export default DBService;
