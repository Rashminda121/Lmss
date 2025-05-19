const User = require("../models/userModel");
const Discussion = require("../models/discussionModel");
const Event = require("../models/eventModel");
const DisComment = require("../models/discussionCommentsModel");
const EventComment = require("../models/eventCommentsModel");
const Article = require("../models/articleModel");
const { connectMysqlDB } = require("../db/db");
const {
  dashboard,
  listUsers,
  listArticles,
  listCourses,
  listCourseCategories,
  listDiscussions,
  listEvents,
  listDisComments,
  listEventComments,
} = require("../controllers/adminController");

jest.mock("../models/userModel");
jest.mock("../models/discussionModel");
jest.mock("../models/eventModel");
jest.mock("../models/discussionCommentsModel");
jest.mock("../models/eventCommentsModel");
jest.mock("../models/articleModel");
jest.mock("../db/db");

describe("dashboard controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it("should return counts on success", async () => {
    Discussion.countDocuments.mockResolvedValue(5);
    User.countDocuments.mockResolvedValue(10);
    Event.countDocuments.mockResolvedValue(7);
    DisComment.countDocuments.mockResolvedValue(3);
    EventComment.countDocuments.mockResolvedValue(4);
    Article.countDocuments.mockResolvedValue(8);

    const mockMysqlConnection = {
      execute: jest.fn().mockResolvedValue([[{ courseCount: 12 }]]),
      end: jest.fn(),
    };
    connectMysqlDB.mockResolvedValue(mockMysqlConnection);

    await dashboard(req, res);

    expect(Discussion.countDocuments).toHaveBeenCalled();
    expect(User.countDocuments).toHaveBeenCalled();
    expect(Event.countDocuments).toHaveBeenCalled();
    expect(DisComment.countDocuments).toHaveBeenCalled();
    expect(EventComment.countDocuments).toHaveBeenCalled();
    expect(Article.countDocuments).toHaveBeenCalled();

    expect(connectMysqlDB).toHaveBeenCalled();
    expect(mockMysqlConnection.execute).toHaveBeenCalledWith(
      "SELECT COUNT(*) AS courseCount FROM course"
    );
    expect(mockMysqlConnection.end).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      discussionCount: 5,
      userCount: 10,
      courseCount: 12,
      eventCount: 7,
      commentCount: 7,
      disCommentCount: 3,
      eventCommentCount: 4,
      articleCount: 8,
    });
  });

  it("should handle errors gracefully", async () => {
    const error = new Error("DB failure");
    Discussion.countDocuments.mockRejectedValue(error);

    await dashboard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error getting dashboard data",
      error: "DB failure",
    });
  });
});

describe("listUsers controller", () => {
  let req, res;

  beforeEach(() => {
    req = {}; // no special data needed for this controller
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and users array when users are found", async () => {
    const mockUsers = [
      { _id: "1", name: "User One" },
      { _id: "2", name: "User Two" },
    ];

    User.find = jest.fn().mockResolvedValue(mockUsers);

    await listUsers(req, res);

    expect(User.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it("should return 404 when no users found", async () => {
    User.find = jest.fn().mockResolvedValue([]);

    await listUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No users found." });
  });

  it("should return 500 on error", async () => {
    const errorMessage = "DB error";
    User.find = jest.fn().mockRejectedValue(new Error(errorMessage));

    await listUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error getting users",
      error: errorMessage,
    });
  });
});

describe("Admin controller tests", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // listArticles tests
  describe("listArticles", () => {
    it("returns 200 and articles when found", async () => {
      const mockArticles = [{ _id: "1", title: "Article 1" }];
      Article.find = jest.fn().mockResolvedValue(mockArticles);

      await listArticles(req, res);

      expect(Article.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockArticles);
    });

    it("returns 404 when no articles found", async () => {
      Article.find = jest.fn().mockResolvedValue([]);

      await listArticles(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No articles found." });
    });

    it("returns 500 on error", async () => {
      const errorMessage = "DB error";
      Article.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      await listArticles(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting articles",
        error: errorMessage,
      });
    });
  });

  // listCourses tests
  describe("listCourses", () => {
    it("returns 200 and courses on success", async () => {
      const mockCourses = [{ id: 1, name: "Course 1" }];
      const endMock = jest.fn();
      const executeMock = jest.fn().mockResolvedValue([mockCourses]);
      const mockConnection = {
        execute: executeMock,
        end: endMock,
      };
      connectMysqlDB.mockResolvedValue(mockConnection);

      await listCourses(req, res);

      expect(connectMysqlDB).toHaveBeenCalled();
      expect(executeMock).toHaveBeenCalledWith("SELECT * FROM course");
      expect(endMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCourses);
    });

    it("returns 500 on error", async () => {
      const errorMessage = "MySQL error";
      connectMysqlDB.mockRejectedValue(new Error(errorMessage));

      await listCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting courses",
        error: errorMessage,
      });
    });
  });

  // listCourseCategories tests
  describe("listCourseCategories", () => {
    it("returns 200 and categories on success", async () => {
      const mockCategories = [{ id: 1, name: "Category 1" }];
      const endMock = jest.fn();
      const executeMock = jest.fn().mockResolvedValue([mockCategories]);
      const mockConnection = {
        execute: executeMock,
        end: endMock,
      };
      connectMysqlDB.mockResolvedValue(mockConnection);

      await listCourseCategories(req, res);

      expect(connectMysqlDB).toHaveBeenCalled();
      expect(executeMock).toHaveBeenCalledWith("SELECT * FROM category");
      expect(endMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategories);
    });

    it("returns 500 on error", async () => {
      const errorMessage = "MySQL error";
      connectMysqlDB.mockRejectedValue(new Error(errorMessage));

      await listCourseCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting category",
        error: errorMessage,
      });
    });
  });

  // listDiscussions tests
  describe("listDiscussions", () => {
    it("returns 200 and updated discussions when found", async () => {
      const mockDiscussions = [
        {
          _id: "1",
          title: "Discussion 1",
          save: jest.fn().mockResolvedValue(true),
        },
      ];
      Discussion.find = jest.fn().mockResolvedValue(mockDiscussions);
      DisComment.countDocuments = jest.fn().mockResolvedValue(5);

      await listDiscussions(req, res);

      expect(Discussion.find).toHaveBeenCalledWith({});
      expect(DisComment.countDocuments).toHaveBeenCalledWith({ disid: "1" });
      expect(mockDiscussions[0].comments).toBe(5);
      expect(mockDiscussions[0].save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDiscussions);
    });

    it("returns 404 when no discussions found", async () => {
      Discussion.find = jest.fn().mockResolvedValue([]);

      await listDiscussions(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No discussions found.",
      });
    });

    it("returns 500 on error", async () => {
      const errorMessage = "DB error";
      Discussion.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      await listDiscussions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting discussions",
        error: errorMessage,
      });
    });
  });

  describe("listEvents", () => {
    it("returns 200 and updated events when found", async () => {
      const mockEvents = [
        { _id: "1", toObject: () => ({ id: "1", name: "Event 1" }) },
      ];

      Event.find = jest.fn().mockResolvedValue(mockEvents);
      EventComment.countDocuments = jest.fn().mockResolvedValue(3);

      await listEvents(req, res);

      expect(Event.find).toHaveBeenCalledWith({});
      expect(EventComment.countDocuments).toHaveBeenCalledWith({ eid: "1" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: "1", name: "Event 1", comments: 3 },
      ]);
    });

    it("returns 404 when no events found", async () => {
      Event.find = jest.fn().mockResolvedValue([]);

      await listEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No events found." });
    });

    it("returns 500 on error", async () => {
      const errorMessage = "DB error";
      Event.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      await listEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting events",
        error: errorMessage,
      });
    });
  });

  // listDisComments tests
  describe("listDisComments", () => {
    it("returns 200 and comments when found", async () => {
      const mockComments = [{ _id: "c1", text: "Comment 1" }];
      DisComment.find = jest.fn().mockResolvedValue(mockComments);

      await listDisComments(req, res);

      expect(DisComment.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockComments);
    });

    it("returns 404 when no comments found", async () => {
      DisComment.find = jest.fn().mockResolvedValue([]);

      await listDisComments(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No comments found." });
    });

    it("returns 500 on error", async () => {
      const errorMessage = "DB error";
      DisComment.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      await listDisComments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting comments",
        error: errorMessage,
      });
    });
  });

  // listEventComments tests
  describe("listEventComments", () => {
    it("returns 200 and comments when found", async () => {
      const mockComments = [{ _id: "ec1", text: "Event Comment 1" }];
      EventComment.find = jest.fn().mockResolvedValue(mockComments);

      await listEventComments(req, res);

      expect(EventComment.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockComments);
    });

    it("returns 404 when no comments found", async () => {
      EventComment.find = jest.fn().mockResolvedValue([]);

      await listEventComments(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No comments found." });
    });

    it("returns 500 on error", async () => {
      const errorMessage = "DB error";
      EventComment.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      await listEventComments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting comments",
        error: errorMessage,
      });
    });
  });
});
