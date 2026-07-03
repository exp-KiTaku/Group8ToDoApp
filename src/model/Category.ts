export class Category {
  readonly id: string;
  name: string;
  color: string; // 要調査

  constructor(id: string, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

  getName = () => this.name;

  setName(name: string): void {
    this.name = name;
  }

  getColor = () => this.color;

  setColor(color: string): void {
    this.color = color;
  }
}