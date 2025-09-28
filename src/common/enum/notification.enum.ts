export interface INotificationSetting {
	order_setting: {
		employee_receive_notifies: number[];
	};
}

export enum NOTIFICATION_OBJECT_TYPE {
	ORDER = 12850,
	USER = 12880,
	CUSTOMER = 12900,
	CAMPAIGN = 12910,
	ACCOUNTING = 13040,
	HRM = 13030,

	COURSE = 13060,
	COURSE_REMINDER = 13061,
	HITA_DIAMOND_MOBILE = 13062,
	ESCALATION_REMINDER = 13063, // nhắc nhở tới GM về vấn đề chưa trả lời câu hỏi của học sinh
	STUDENT_ADD_MESSAGE_MENTOR = 13064, // thông báo tới mentor khi học sinh hỏi câu hỏi
	MENTOR_REPLIED_MESSAGE_STUDENT = 13065, // thông báo tới học viên khi mentor đã trả lời câu hỏi
}

export enum NOTIFICATION_ACTION_TYPE {
	CREATE = 1,
	UPDATE = 2,
	DELETE = 3,
	CHANGE_STATUS = 4,
	CANCEL = 5,
	WARNING = 6,
}

export enum NOTIFICATION_TYPE {
	SYSTEM = 1,
	USER = 2,
}
