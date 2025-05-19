const User = require("../models/userModel");
const Discussion = require("../models/discussionModel");
const Event = require("../models/eventModel");
const DisComment = require("../models/discussionCommentsModel");
const EventComment = require("../models/eventCommentsModel");
const {
  userProfile,
  listDiscussions,
  viewDiscussion,
  listEvents,
  viewEvent,
  viewDisComments,
  viewEventComments,
  viewCourseQuestions,
  listUsersChat,
} = require("../controllers/userController");

describe("userProfile", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("returns 400 if uid is missing", async () => {
    req.query = { email: "test@example.com" };

    await userProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing user ID or email.",
    });
  });

  it("returns 404 if user not found", async () => {
    req.query = { uid: "123" };
    User.findOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await userProfile(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ uid: "123" });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found." });
  });

  it("returns 200 with user data when email is not provided", async () => {
    const mockUser = {
      _id: "abc123",
      name: "Test User",
      email: "test@example.com",
      phone: "123456789",
      image: "img.jpg",
      role: "student",
      address: "123 Street",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    req.query = { uid: "123" };
    User.findOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    await userProfile(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ uid: "123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it("returns 200 with user data when email is provided", async () => {
    const mockUser = {
      _id: "abc123",
      name: "Test User",
      email: "test@example.com",
      phone: "123456789",
      image: "img.jpg",
      role: "student",
      address: "123 Street",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    req.query = { uid: "123", email: "test@example.com" };
    User.findOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    await userProfile(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      uid: "123",
      email: "test@example.com",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it("returns 500 on database error", async () => {
    req.query = { uid: "123" };
    User.findOne = jest.fn().mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await userProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "DB error",
    });
  });
});

describe("Discussion Controllers", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe("listDiscussions", () => {
    it("returns 404 if no discussions found", async () => {
      Discussion.find = jest.fn().mockResolvedValue([]);

      await listDiscussions(req, res);

      expect(Discussion.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No discussions found.",
      });
    });

    it("returns 200 with updated discussions including comment counts", async () => {
      const discussionsMock = [
        { _id: "1", save: jest.fn() },
        { _id: "2", save: jest.fn() },
      ];

      Discussion.find = jest.fn().mockResolvedValue(discussionsMock);
      DisComment.countDocuments = jest.fn().mockImplementation(({ disid }) => {
        return disid === "1" ? Promise.resolve(3) : Promise.resolve(5);
      });

      await listDiscussions(req, res);

      expect(Discussion.find).toHaveBeenCalled();
      expect(DisComment.countDocuments).toHaveBeenCalledTimes(2);
      expect(discussionsMock[0].comments).toBe(3);
      expect(discussionsMock[1].comments).toBe(5);
      expect(discussionsMock[0].save).toHaveBeenCalled();
      expect(discussionsMock[1].save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(discussionsMock);
    });

    it("returns 500 on error", async () => {
      Discussion.find = jest.fn().mockRejectedValue(new Error("DB failure"));

      await listDiscussions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting discussions",
        error: "DB failure",
      });
    });
  });

  describe("viewDiscussion", () => {
    it("returns 400 if id is missing", async () => {
      req.body = {};

      await viewDiscussion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing discussion ID.",
      });
    });

    it("returns 404 if discussion not found", async () => {
      req.body = { id: "abc123" };
      Discussion.findOne = jest.fn().mockResolvedValue(null);

      await viewDiscussion(req, res);

      expect(Discussion.findOne).toHaveBeenCalledWith({ _id: "abc123" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No discussions found.",
      });
    });

    it("returns 200 with discussion data", async () => {
      const mockDiscussion = { _id: "abc123", title: "Test Discussion" };
      req.body = { id: "abc123" };
      Discussion.findOne = jest.fn().mockResolvedValue(mockDiscussion);

      await viewDiscussion(req, res);

      expect(Discussion.findOne).toHaveBeenCalledWith({ _id: "abc123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDiscussion);
    });

    it("returns 500 on error", async () => {
      req.body = { id: "abc123" };
      Discussion.findOne = jest.fn().mockRejectedValue(new Error("DB failure"));

      await viewDiscussion(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting discussions",
        error: "DB failure",
      });
    });
  });
});

describe("Event Controllers", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe("listEvents", () => {
    it("returns 404 if no events found", async () => {
      Event.find = jest.fn().mockResolvedValue([]);

      await listEvents(req, res);

      expect(Event.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No events found." });
    });

    it("returns 200 with events including comment counts", async () => {
      const eventsMock = [
        { _id: "1", toObject: () => ({ _id: "1", name: "Event 1" }) },
        { _id: "2", toObject: () => ({ _id: "2", name: "Event 2" }) },
      ];

      Event.find = jest.fn().mockResolvedValue(eventsMock);
      EventComment.countDocuments = jest.fn().mockImplementation(({ eid }) => {
        return eid === "1" ? Promise.resolve(4) : Promise.resolve(7);
      });

      await listEvents(req, res);

      expect(Event.find).toHaveBeenCalled();
      expect(EventComment.countDocuments).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { _id: "1", name: "Event 1", comments: 4 },
        { _id: "2", name: "Event 2", comments: 7 },
      ]);
    });

    it("returns 500 on error", async () => {
      Event.find = jest.fn().mockRejectedValue(new Error("DB error"));

      await listEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting events",
        error: "DB error",
      });
    });
  });

  describe("viewDisComments", () => {
    let req, res;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      jest.clearAllMocks();
    });

    it("should return 400 if disid is missing", async () => {
      await viewDisComments(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "ID is required" });
    });

    it("should return 404 if no comments found", async () => {
      req.body.disid = "123";
      jest.spyOn(DisComment, "find").mockResolvedValue([]);

      await viewDisComments(req, res);

      expect(DisComment.find).toHaveBeenCalledWith({ disid: "123" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No comments found." });
    });

    it("should return 200 with comments if found", async () => {
      const mockComments = [
        { _id: "c1", text: "First comment" },
        { _id: "c2", text: "Second comment" },
      ];
      req.body.disid = "123";
      jest.spyOn(DisComment, "find").mockResolvedValue(mockComments);

      await viewDisComments(req, res);

      expect(DisComment.find).toHaveBeenCalledWith({ disid: "123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockComments);
    });

    it("should return 500 if an error occurs", async () => {
      req.body.disid = "123";
      jest.spyOn(DisComment, "find").mockRejectedValue(new Error("DB error"));

      await viewDisComments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting comments",
        error: "DB error",
      });
    });
  });

  describe("viewEvent", () => {
    it("returns 400 if id is missing", async () => {
      req.body = {};

      await viewEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Missing event ID." });
    });

    it("returns 404 if event not found", async () => {
      req.body = { id: "event123" };
      Event.findOne = jest.fn().mockResolvedValue(null);

      await viewEvent(req, res);

      expect(Event.findOne).toHaveBeenCalledWith({ _id: "event123" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No events found." });
    });

    it("returns 200 with event data", async () => {
      const mockEvent = { _id: "event123", title: "Sample Event" };
      req.body = { id: "event123" };
      Event.findOne = jest.fn().mockResolvedValue(mockEvent);

      await viewEvent(req, res);

      expect(Event.findOne).toHaveBeenCalledWith({ _id: "event123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    it("returns 500 on error", async () => {
      req.body = { id: "event123" };
      Event.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

      await viewEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting events",
        error: "DB error",
      });
    });
  });
});

describe("viewEventComments", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it("returns 400 if eid is missing", async () => {
    await viewEventComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "ID is required" });
  });

  it("returns 404 if no comments found", async () => {
    req.body.eid = "test-id";
    jest.spyOn(EventComment, "find").mockResolvedValue([]);
    await viewEventComments(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No comments found." });
  });

  it("returns 200 with comments", async () => {
    req.body.eid = "test-id";
    const comments = [{ text: "Comment 1" }];
    jest.spyOn(EventComment, "find").mockResolvedValue(comments);
    await viewEventComments(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(comments);
  });

  it("returns 500 on error", async () => {
    req.body.eid = "test-id";
    jest.spyOn(EventComment, "find").mockRejectedValue(new Error("Error"));
    await viewEventComments(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error getting comments",
      error: "Error",
    });
  });
});

describe("viewCourseQuestions", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it("returns 400 if courseId is missing", async () => {
    await viewCourseQuestions(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Course ID is required",
    });
  });

  it("returns empty list if no questions found", async () => {
    req.body.courseId = "course1";
    jest.spyOn(CourseQuestion, "find").mockReturnValue({
      sort: () => ({ populate: async () => [] }),
    });

    await viewCourseQuestions(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "No questions found",
      questions: [],
    });
  });

  it("returns questions if found", async () => {
    req.body.courseId = "course1";
    const questions = [{ question: "What is Node.js?" }];
    jest.spyOn(CourseQuestion, "find").mockReturnValue({
      sort: () => ({ populate: async () => questions }),
    });

    await viewCourseQuestions(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Questions retrieved successfully",
      questions,
    });
  });

  it("returns 500 on error", async () => {
    req.body.courseId = "course1";
    jest.spyOn(CourseQuestion, "find").mockImplementation(() => {
      throw new Error("DB Error");
    });

    await viewCourseQuestions(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error getting questions",
      error: "DB Error",
    });
  });
});

describe("listUsersChat", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it("returns 404 if no users found", async () => {
    jest.spyOn(User, "find").mockResolvedValue([]);
    await listUsersChat(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No users found." });
  });

  it("returns list of users", async () => {
    const users = [
      {
        name: "Rash",
        email: "rash@example.com",
        image: "img.png",
        role: "user",
      },
    ];
    jest.spyOn(User, "find").mockResolvedValue(users);
    await listUsersChat(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it("returns 500 on error", async () => {
    jest
      .spyOn(User, "find")
      .mockRejectedValue(new Error("Error fetching users"));
    await listUsersChat(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error getting users",
      error: "Error fetching users",
    });
  });
});
