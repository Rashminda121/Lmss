const User = require("../models/userModel");
const { listCourseUsers } = require("../controllers/lecturerController");

describe("listCourseUsers", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if userIds is missing or empty", async () => {
    req.body.userIds = null;
    await listCourseUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "userIds array is required.",
    });

    req.body.userIds = [];
    await listCourseUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "userIds array is required.",
    });
  });

  it("returns 404 if no users found", async () => {
    req.body.userIds = ["123"];
    // Mock User.find().select() to resolve to empty array
    User.find = jest.fn(() => ({
      select: jest.fn().mockResolvedValue([]),
    }));

    await listCourseUsers(req, res);

    expect(User.find).toHaveBeenCalledWith({ uid: { $in: req.body.userIds } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No matching users found.",
    });
  });

  it("returns 200 and users if found", async () => {
    req.body.userIds = ["123", "456"];
    const mockUsers = [
      {
        uid: "123",
        name: "User One",
        email: "one@example.com",
        image: "img1",
        role: "student",
      },
      {
        uid: "456",
        name: "User Two",
        email: "two@example.com",
        image: "img2",
        role: "teacher",
      },
    ];

    User.find = jest.fn(() => ({
      select: jest.fn().mockResolvedValue(mockUsers),
    }));

    await listCourseUsers(req, res);

    expect(User.find).toHaveBeenCalledWith({ uid: { $in: req.body.userIds } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it("returns 500 on error", async () => {
    req.body.userIds = ["123"];
    User.find = jest.fn(() => ({
      select: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    await listCourseUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error getting users",
      error: "DB error",
    });
  });
});
