import express from "express";
const router = express.Router();
import coursesController from "../controllers/course_controller";
import authMiddleware from "../common/auth_middleware";
import { upload_vid } from "../common/file_upload";

//kaplan!!!



//get all the courses or get a course by parameters of the course( id, name, owner, description, videoUrl, Count)

// router.get("/", authMiddleware, coursesController.get.bind(coursesController));
router.get("/", coursesController.get.bind(coursesController));

//get all the courses of a specific user
// router.get("/:id", authMiddleware, coursesController.getByUserId.bind(coursesController));
router.get("/:id",authMiddleware, coursesController.getByUserId.bind(coursesController));

//upload new course
router.post("/", authMiddleware, coursesController.post.bind(coursesController));
//upload new video
router.post("/upload_Video", authMiddleware, upload_vid.single("video"), coursesController.postVideo.bind(coursesController));
router.put("/:id", authMiddleware, coursesController.putById.bind(coursesController));

router.delete("/:id", authMiddleware, coursesController.deleteById.bind(coursesController));

export default router;

/**
* @swagger
* tags:
*   name: Courses
*   description: The course  management API is used for getting, adding, updating, and deleting courses. The server uses JWT for authentication. 
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         owner:
 *           type: string
 *         owner_name:
 *           type: string
 *         description:
 *           type: string
 *         Count:
 *           type: number
 *           between: 0, 5
 *         videoUrl:
 *           type: string
 *       required:
 *         - name
 *         - owner
 *         - owner_name
 *         - Count
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get courses
 *     description: Retrieve all courses or filter courses by a specific query parameter
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter courses by name
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *         description: Filter courses by owner (user ID)
 *     responses:
 *       '200':
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get all courses of a specific user
 *     tags: [Courses]
 *     description: Retrieves all courses owned by a specific user based on user ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user whose courses are to be retrieved
 *     responses:
 *       '200':
 *         description: A list of courses owned by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Upload a new course
 *     tags: [Courses]
 *     description: Creates a new course with authentication, sets owner information automatically, and initializes Count to 0
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       '201':
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       '401':
 *         description: Unauthorized request
 *       '406':
 *         description: Course creation failed - Object already exists
 *       '500':
 *         description: Internal server error
 */


/**
 * @swagger
 * /courses/upload_Video:
 *   post:
 *     summary: Upload a new video
 *     tags: [Courses]
 *     description: |
 *       Uploads a new video file with authentication, storing it in the server and returning the URL of the uploaded video (while render the name of the video in the server).
 *       Only video files of type 'video/mp4' are allowed.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: formData
 *         name: video
 *         type: file
 *         description: The video file to upload.
 *         required: true
 *         allowedTypes: 'video/mp4 , video/webm, video/quicktime'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   description: URL of the uploaded video
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course by ID
 *     tags: [Courses]
 *     description: Update an existing course by its ID with authentication. Only the course owner can modify the course, and they can only change certain fields (not owner_name and _id). If the user is not authorized or the course is not found, appropriate error messages are returned.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the course to update
 *       - in: body
 *         name: body
 *         description: Updated course object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               format: uuid
 *               description: The ID of the course (must match the ID in the path)
 *             owner_name:
 *               type: string
 *               description: The name of the course owner
 *     responses:
 *       '200':
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       '401':
 *         description: Unauthorized request
 *       '403':
 *         description: User not authorized to change this course
 *       '404':
 *         description: Course not found
 *       '500':
 *         description: Internal server error
 */



/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     description: Delete an existing course by its ID with authentication. Only the course owner can delete the course. This endpoint also deletes all associated course reviews. If the user is not authorized or the course is not found, appropriate error messages are returned.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the course to delete
 *     responses:
 *       '200':
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                   description: Number of deleted documents
 *                 ok:
 *                   type: number
 *                   description: Indicates if the operation was successful
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Course not found
 *       '500':
 *         description: Internal server error
 */
