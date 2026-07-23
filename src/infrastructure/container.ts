import "reflect-metadata";
import { Container } from "inversify";
import type { ICategoryRepository } from "../repositories/ICategoryRepository";
import { LocalStorageCategoryRepository } from "../repositories/LocalStorageCategoryRepository";
import type { ITaskRepository } from "../repositories/ITaskRepository";
import { LocalStorageTaskRepository } from "../repositories/LocalStorageTaskRepository";
import type { ICategoryService } from "../services/ICategoryService";
import { CategoryService } from "../services/CategoryService";
import type { ITaskService } from "../services/ITaskService";
import { TaskService } from "../services/TaskService";
import { TYPES } from "./types";

const container = new Container();

container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(LocalStorageCategoryRepository).inSingletonScope();
container.bind<ITaskRepository>(TYPES.ITaskRepository).to(LocalStorageTaskRepository).inSingletonScope();
container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService).inSingletonScope();
container.bind<ITaskService>(TYPES.ITaskService).to(TaskService).inSingletonScope();

export { container };