import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

const container = new Container();

// container.bind<本実装クラス>(TYPES.[types.tsに登録したシンボル]).to(本実装クラス);

export { container };