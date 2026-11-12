export interface UserRemoverRepository {
  remove(id: number): Promise<boolean>;
}
