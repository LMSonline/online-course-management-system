from enum import Enum


class Intent(str, Enum):
    ASK_COURSE_QA = "ASK_COURSE_QA"
    ASK_GENERAL_QA = "ASK_GENERAL_QA"
    ASK_RECOMMEND = "ASK_RECOMMEND"
    ASK_STUDY_PLAN = "ASK_STUDY_PLAN"
    UNKNOWN = "UNKNOWN"


class Sender(str, Enum):
    USER = "USER"
    BOT = "BOT"
