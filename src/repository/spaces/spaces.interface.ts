import { Space } from "../../entities";

export interface SpacesRepository {
  get(spaceId: string): Promise<Space>;
  getAll(): Promise<Space[]>;
  create(data: any): Promise<string>;
  update(spaceId: string, space: Partial<Space>): Promise<Space>;
  delete(spaceId: string): Promise<string>;
}
