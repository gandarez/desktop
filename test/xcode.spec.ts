import Xcode from "../src/editors/xcode";

const sinon = require("sinon");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

const { expect } = chai;
chai.use(chaiAsPromised);

describe("Xcode", () => {
  let xcode: Xcode;
  let isDirectoryStub: any;

  beforeEach(() => {
    xcode = new Xcode();
    isDirectoryStub = sinon.stub(xcode, "isDirectory");
  });
  afterEach(() => {
    isDirectoryStub.restore();
  });
  it("should return the correct binary name", () => {
    const result = xcode.name;
    expect(result).to.equal("xed");
  });
  it("should return the correct editor name", () => {
    const result = xcode.displayName;
    expect(result).to.equal("Xcode");
  });
  it("should return TRUE if editor is installed", async () => {
    isDirectoryStub.resolves(true);
    const result = await xcode.isEditorInstalled();
    expect(result).to.be.true;
  });
  // it('should return FALSE if editor is not installed', async () => {
  //     isDirectoryStub.resolves(false);
  //     const result = await xcode.isEditorInstalled();
  //     expect(result).to.be.false;
  // });
  it("should return TRUE if plugin is installed", async () => {
    isDirectoryStub.resolves(true);
    const result = await xcode.isPluginInstalled();
    expect(result).to.be.true;
  });
  it("should return FALSE if plugin is n ot installed", async () => {
    isDirectoryStub.resolves(false);
    const result = await xcode.isPluginInstalled();
    expect(result).to.be.false;
  });
});
