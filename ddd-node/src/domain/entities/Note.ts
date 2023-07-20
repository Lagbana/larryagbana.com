export default class Note {
  title: string;
  content: string;
  userId: string;

  constructor(title: string, content: string, userId: string) {
    this.title = title;
    this.content = content;
    this.userId = userId;
  }
}
