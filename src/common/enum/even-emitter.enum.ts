export enum EVENT_LISTENER {
	CAREGIVER_REMIND_STUDENT_NOTIFICATION = 'notification.caregiver-remind-student', // Thông báo cho Người chăm sóc là hãy nhắc Học viên làm bài tập
	ESCALATION_REMINDER_TO_MANAGER = 'notification.escalation-reminder-to-manager', // Thông báo cho quản lý khi caregiver/instructor quá hạn chưa trả lời học viên

	REMIND_STUDENT_DO_ASSIGNMENT_NOTIFICATION = 'notification.remind-student-do-assignment', // Thông báo cho Học viên làm bài tập thành công
	// thông báo tới mentor khi học sinh hỏi câu hỏi
	STUDENT_ADD_MESSAGE_MENTOR_NOTIFICATION = 'notification.student-add-message-mentor-notification',
	// thông báo tới học viên khi mentor đã trả lời câu hỏi
	MENTOR_REPLIED_STUDENT_NOTIFICATION = 'notification.mentor-replied-student-notification',

	ASSIGN_STUDENT_TO_NOT_STARTED_COURSE = 'enrollment.assign-student-to-not-started-course', // Thêm mới học viên vào các khóa học chưa bắt đầu
}
