import config from "../../playwright.config";

type WebServer = {
  command: string;
  url: string;
};

describe("playwright.config.ts webServer", () => {
  it("has a webServer block defined", () => {
    expect(config.webServer).toBeDefined();
  });

  it("webServer uses npm start and serves at http://localhost:3000", () => {
    const ws = config.webServer as WebServer;
    expect(ws.command).toBe("npm start");
    expect(ws.url).toBe("http://localhost:3000");
  });
});
