class URLValueObject {
  private _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error("URL cannot be empty");
    }
    // Simple regex for URL validation (covers http/https)
    const urlRegex = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/;
    if (!urlRegex.test(value)) {
      throw new Error("Invalid URL format");
    }
  }

  get value(): string {
    return this._value;
  }
}

export default URLValueObject;
