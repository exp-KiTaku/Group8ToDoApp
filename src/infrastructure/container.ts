import "reflect-metadata";
import { Container } from "inversify";
import type { ICategoryRepository } from "../repositories/ICategoryRepository";
import type { ICategoryService } from "../services/ICategoryService";
import { CategoryService } from "../services/CategoryService";
import type { ITaskService } from "../services/ITaskService";
import { TaskService } from "../services/TaskService";
import { TYPES } from "./types";

import type { ITaskRepository } from "../repositories/ITaskRepository";

import { InMemoryCategoryRepository } from "../repositories/InMemoryCategoryRepository";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";

const container = new Container();

// container.bind<インターフェース>(TYPES.[types.tsに登録したシンボル]).to(実装クラス); のようにする
//container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository);
container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(InMemoryCategoryRepository);
container.bind<ITaskRepository>(TYPES.ITaskRepository).to(InMemoryTaskRepository);
container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService);
container.bind<ITaskService>(TYPES.ITaskService).to(TaskService);

export { container };