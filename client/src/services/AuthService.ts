export class AuthService {
  async login(username: string, password: string): Promise<Object | undefined> {
    return {
      user: "abc",
    };
  }

  getUsername() {
    return "some user";
  }
}
