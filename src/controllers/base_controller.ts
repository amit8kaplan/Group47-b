import { Request, Response } from "express";
import mongoose, { FilterQuery, Model } from "mongoose";

export class BaseController<ModelType>{

    model: Model<ModelType>
    constructor(model: Model<ModelType>) {
        this.model = model;
    }

    async get(req: Request, res: Response) {
        ////console.log("Get by query parameter:");
        try {
            const queryKey = Object.keys(req.query)[0]; // Get the first query parameter
            const queryValue = req.query[queryKey]; // Get the value of the first query parameter
            // //////console.log("Query parameter key:", queryKey);
            // //////console.log("Query parameter value:", queryValue);
    
            if (queryKey && queryValue) {
                const filter: FilterQuery<ModelType> = { [queryKey]: { $regex: new RegExp(String(queryValue), 'i') } } as FilterQuery<ModelType>; 
                        
                const obj = await this.model.find(filter);
                ////console.log("Get boobjdy:", JSON.stringify(obj, null, 2));
                res.send(obj);
            } else {
                const obj = await this.model.find();
                ////console.log("All res:", JSON.stringify(obj, null, 2));
                res.send(obj);
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    
    

    async getById(req: Request, res: Response) {
        ////////console.log("getById:" + req.params.id);
        try {
            const obj = await this.model.findById(req.params.id);
            ////////console.log("getById obj :", JSON.stringify(obj, null, 2));
            res.send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async post(req: Request, res: Response) {
        ////console.log("postooObj:");
        ////console.log(req.body.title);
        ////console.log("the body _id:" + req.body._id)
        try {
            let isExist =null;
            // if (req.body._id is not null)
            // {   
            //     isExist = await this.model.findById(req.body._id);
            //     ////console.log("isExist:" + isExist);
            // }
            // ////console.log("isExist:" + isExist);

            ////console.log(req.body.name)
            const body = req.body;
            ////console.log("body.title:" + body.title);
            ////console.log("body:" + JSON.stringify(body, null, 2));
            // if (isExist == null)
            // {
                const obj = await this.model.create(body);
                ////console.log("postnewObj:" + obj);
                ////console.log("title" + req.body.title);
                res.status(201).send(obj);
            // }
            // else
            // {
            //     ////console.log("Object already exist");
            //     res.status(406).send("fail2: " + "Object already exist");
            // }
        }
        catch (err) {
        ////console.log(err);
        res.status(406).send("fail 1: " + err.message);
            }
   }

    async putById(req: Request, res: Response) {
        //////////////console.log("putObjectById:" + req.params.id);
        try {
            const obj = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            //////////////console.log("putObjectById:" + obj);
            if (!obj) {
                res.status(404).json({ message: "Object not found" });
            }
            res.status(200).json(obj);
        } catch (err) {
            //////////////console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
    
    async deleteById(req: Request, res: Response) {
        //////////////console.log("deleteObjectById in base_Controller:" + req.params.id);
        //////////////console.log("type of the id in base controller: " + typeof(req.params.id));
        this.model.deleteOne({ _id: req.params.id }).then((result) => {
            //////////console.log("result:" + result);
            res.status(200).json(result);
        }).catch((err) => {
            //////////console.log("err:" + err);
            res.status(500).json({ message: err.message });
        });
    }
    
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
}

export default createController;