import {
  NextFunction,
  Request,
  Response,
  Router,
  RequestHandler,
} from 'express';
import verify from '../middlewares/authentication';
import db from '../services/db';
import HttpError from '../services/http-error';

type QuizBody = {
  title: string;
  theme?: string;
};

const postQuiz = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const quizBody = req.body as QuizBody;

  const quiz = await db.quiz.create({
    data: {
      title: quizBody.title,
      theme: quizBody.theme,
      owner: {
        connect: {
          id: user?.id as string,
        },
      },
    },
  });

  try {
    res.json({
      id: quiz.id,
      title: quiz.title,
      theme: quiz.theme,
    });
  } catch (e) {
    next(e);
  }
};

const patchQuiz: RequestHandler = async (req, res, next) => {
  try {
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

const getQuiz: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };

    const quiz = await db.quiz.findFirst({
      where: { id },
      include: { Questions: true },
    });

    if (!quiz) throw HttpError.notFound(`Quiz with id (${id}) was not found`);

    res.json({
      id: quiz.id,
      title: quiz.title,
      theme: quiz.theme,
      questions: quiz.Questions,
    });
  } catch (e) {
    next(e);
  }
};

const getQuizList: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req;

    const quizList = await db.quiz.findMany({
      where: { userId: user.id },
      include: { Questions: true },
    });

    res.json(
      quizList.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        theme: quiz.theme,
        questions: quiz.Questions,
      }))
    );
  } catch (e) {
    next(e);
  }
};

const deleteQuiz: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { user } = req;
    const { id } = req.params as { id: string };

    const { count } = await db.quiz.deleteMany({
      where: { id, userId: user.id },
    });

    if (count === 0) {
      throw HttpError.notFound(`Quiz with id (${id}) was not found for user`);
    }

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

export default function registerRoutes(router: Router) {
  router.get('/quiz', verify, getQuizList);
  router.get('/quiz/:id', verify, getQuiz);
  router.post('/quiz', verify, postQuiz);
  router.patch('/quiz/:id', verify, patchQuiz);
  router.delete('/quiz/:id', verify, deleteQuiz);
}
