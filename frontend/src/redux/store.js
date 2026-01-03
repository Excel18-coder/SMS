import { configureStore } from "@reduxjs/toolkit";
import { assignmentReducer } from "./assignmentRelated/assignmentSlice";
import { complainReducer } from "./complainRelated/complainSlice";
import { eventReducer } from "./eventRelated/eventSlice";
import { feeReducer } from "./feeRelated/feeSlice";
import { libraryReducer } from "./libraryRelated/librarySlice";
import { messageReducer } from "./messageRelated/messageSlice";
import { noticeReducer } from "./noticeRelated/noticeSlice";
import { sclassReducer } from "./sclassRelated/sclassSlice";
import { studentReducer } from "./studentRelated/studentSlice";
import { teacherReducer } from "./teacherRelated/teacherSlice";
import { timetableReducer } from "./timetableRelated/timetableSlice";
import { userReducer } from "./userRelated/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    student: studentReducer,
    teacher: teacherReducer,
    notice: noticeReducer,
    complain: complainReducer,
    sclass: sclassReducer,
    assignment: assignmentReducer,
    fee: feeReducer,
    library: libraryReducer,
    event: eventReducer,
    message: messageReducer,
    timetable: timetableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types as we've fixed error serialization
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
