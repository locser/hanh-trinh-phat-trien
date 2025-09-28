import { REMINDER_CANCELLATION_REASON } from '../database/entities/reminder-tracker.entity';
import { THREAD_STATUS } from '../database/entities/comment-thread.entity';

export class ReminderHelperUtil {
    /**
     * Lấy lý do cancel reminder dựa trên enum
     */
    static getCancellationReasonText(reason: REMINDER_CANCELLATION_REASON): string {
        const reasonMap: Record<REMINDER_CANCELLATION_REASON, string> = {
            [REMINDER_CANCELLATION_REASON.STAFF_REPLIED]: 'Staff đã trả lời trong thread',
            [REMINDER_CANCELLATION_REASON.THREAD_MARKED_ANSWERED]: 'Thread được đánh dấu là đã trả lời bởi staff',
            [REMINDER_CANCELLATION_REASON.THREAD_MARKED_RESOLVED]: 'Thread được đánh dấu là đã giải quyết bởi staff',
            [REMINDER_CANCELLATION_REASON.THREAD_MARKED_CLOSED]: 'Thread được đánh dấu là đã đóng bởi staff',
            [REMINDER_CANCELLATION_REASON.MANUAL_CANCELLATION]: 'Reminder được hủy thủ công',
            [REMINDER_CANCELLATION_REASON.SYSTEM_ERROR]: 'Hủy do lỗi hệ thống',
            [REMINDER_CANCELLATION_REASON.DUPLICATE_REMINDER]: 'Hủy do reminder trùng lặp',
            [REMINDER_CANCELLATION_REASON.OBJECT_DELETED]: 'Hủy do đối tượng liên quan đã bị xóa',
        };

        return reasonMap[reason] || 'Lý do không xác định';
    }

    /**
     * Lấy enum reason dựa trên thread status
     */
    static getThreadStatusCancellationReason(status: THREAD_STATUS): REMINDER_CANCELLATION_REASON {
        const statusReasonMap: Record<THREAD_STATUS, REMINDER_CANCELLATION_REASON> = {
            [THREAD_STATUS.ANSWERED]: REMINDER_CANCELLATION_REASON.THREAD_MARKED_ANSWERED,
            [THREAD_STATUS.RESOLVED]: REMINDER_CANCELLATION_REASON.THREAD_MARKED_RESOLVED,
            [THREAD_STATUS.CLOSED]: REMINDER_CANCELLATION_REASON.THREAD_MARKED_CLOSED,
            // Default fallback cho các status khác
            [THREAD_STATUS.OPEN]: REMINDER_CANCELLATION_REASON.MANUAL_CANCELLATION,
        };

        return statusReasonMap[status] || REMINDER_CANCELLATION_REASON.MANUAL_CANCELLATION;
    }

    /**
     * Tạo cancellation reason với context bổ sung
     */
    static buildCancellationReason(
        baseReason: REMINDER_CANCELLATION_REASON,
        context?: {
            staffId?: number;
            staffName?: string;
            threadId?: number;
            additionalInfo?: string;
        }
    ): string {
        let reasonText = this.getCancellationReasonText(baseReason);

        if (context) {
            const contextParts: string[] = [];

            if (context.staffName) {
                contextParts.push(`bởi ${context.staffName}`);
            } else if (context.staffId) {
                contextParts.push(`bởi staff ID ${context.staffId}`);
            }

            if (context.threadId) {
                contextParts.push(`(Thread #${context.threadId})`);
            }

            if (context.additionalInfo) {
                contextParts.push(context.additionalInfo);
            }

            if (contextParts.length > 0) {
                reasonText += ` - ${contextParts.join(' ')}`;
            }
        }

        return reasonText;
    }

    /**
     * Validate cancellation reason
     */
    static isValidCancellationReason(reason: string): boolean {
        return Object.values(REMINDER_CANCELLATION_REASON).includes(reason as REMINDER_CANCELLATION_REASON);
    }

    /**
     * Lấy tất cả cancellation reasons có thể
     */
    static getAllCancellationReasons(): Array<{
        key: REMINDER_CANCELLATION_REASON;
        text: string;
        description: string;
    }> {
        return [
            {
                key: REMINDER_CANCELLATION_REASON.STAFF_REPLIED,
                text: this.getCancellationReasonText(REMINDER_CANCELLATION_REASON.STAFF_REPLIED),
                description: 'Khi staff trả lời câu hỏi trong thread'
            },
            {
                key: REMINDER_CANCELLATION_REASON.THREAD_MARKED_ANSWERED,
                text: this.getCancellationReasonText(REMINDER_CANCELLATION_REASON.THREAD_MARKED_ANSWERED),
                description: 'Khi thread được đánh dấu là đã trả lời'
            },
            {
                key: REMINDER_CANCELLATION_REASON.THREAD_MARKED_RESOLVED,
                text: this.getCancellationReasonText(REMINDER_CANCELLATION_REASON.THREAD_MARKED_RESOLVED),
                description: 'Khi thread được đánh dấu là đã giải quyết'
            },
            {
                key: REMINDER_CANCELLATION_REASON.THREAD_MARKED_CLOSED,
                text: this.getCancellationReasonText(REMINDER_CANCELLATION_REASON.THREAD_MARKED_CLOSED),
                description: 'Khi thread được đánh dấu là đã đóng'
            },
            {
                key: REMINDER_CANCELLATION_REASON.MANUAL_CANCELLATION,
                text: this.getCancellationReasonText(REMINDER_CANCELLATION_REASON.MANUAL_CANCELLATION),
                description: 'Khi admin/staff hủy reminder thủ công'
            },
            {
                key: REMINDER_CANCELLATION_REASON.SYSTEM_ERROR,
                text: this.getCancellationReasonText(REMINDER_CANCELLATION_REASON.SYSTEM_ERROR),
                description: 'Khi có lỗi hệ thống xảy ra'
            },
            {
                key: REMINDER_CANCELLATION_REASON.DUPLICATE_REMINDER,
                text: this.getCancellationReasonText(REMINDER_CANCELLATION_REASON.DUPLICATE_REMINDER),
                description: 'Khi phát hiện reminder trùng lặp'
            },
            {
                key: REMINDER_CANCELLATION_REASON.OBJECT_DELETED,
                text: this.getCancellationReasonText(REMINDER_CANCELLATION_REASON.OBJECT_DELETED),
                description: 'Khi đối tượng liên quan (thread, course, etc.) bị xóa'
            }
        ];
    }

    /**
     * Lấy cancellation reason cho mentor notification dựa trên context
     */
    static getMentorNotificationCancellationReason(
        action: 'reply' | 'status_change',
        threadStatus?: THREAD_STATUS
    ): REMINDER_CANCELLATION_REASON {
        if (action === 'reply') {
            return REMINDER_CANCELLATION_REASON.STAFF_REPLIED;
        }

        if (action === 'status_change' && threadStatus) {
            return this.getThreadStatusCancellationReason(threadStatus);
        }

        return REMINDER_CANCELLATION_REASON.MANUAL_CANCELLATION;
    }
}