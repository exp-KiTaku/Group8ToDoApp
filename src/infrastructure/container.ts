import "reflect-metadata";
import { Container } from "inversify";
import type { ICategoryRepository } from "../repositories/ICategoryRepository";
import { TYPES } from "./types";

const container = new Container();

// container.bind<インターフェース>(TYPES.[types.tsに登録したシンボル]).to(実装クラス); のようにする
//container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository);

export { container };