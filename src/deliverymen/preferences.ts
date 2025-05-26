import { Router } from 'express';
import { deleteUserPreferences, getAllUsersGrades, getSameGradeUsers, getSameStudyStyleUsers, getSameStudyTimeUsers, getUserGrade, updateUserGrade } from '../handlers/preferences';

const router = Router();

router.route('/grade')
  .put(updateUserGrade)
  .get(getUserGrade);

router.get('/grades', getAllUsersGrades);
router.get('/users/grades', getSameGradeUsers);
router.get('/users/study-time', getSameStudyTimeUsers);
router.get('/users/study-style', getSameStudyStyleUsers);
router.delete('/preferences', deleteUserPreferences);


export default router;