export class Category {
  public readonly id: string;
  public name: string;
  public color: string;

  constructor(id: string, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

  setName(name: string): void {
    if (name.trim() === '') {
      throw new Error('Category name cannot be empty.');
    }

    this.name = name;
  }

  setColor(color: string): void {
    this.color = color;
  }
}