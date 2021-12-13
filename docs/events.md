
| topic | event-name | consumer | handler |
|---|---|---|----|
| ResourceEvent | consultation-module.master.indepth.created  | callcenter-worker | createCallConnect |
| ResourceEvent | consultation-module.master.indepth.created  | calendar-worker | insertCalendar |
| ResourceEvent | consultation-module.master.indepth.updated  | FeeFactory | lockFee |
| ResourceEvent | consultation-module.master.indepth.${originalState}-${updatedState} | wallet-worker | checkTransaction |
| ResourceEvent | consultation-module.master.indepth.${originalState}-${updatedState} | conversation-worker | updateChatPolicy |
| ResourceEvent | consultation-module.master.indepth.medium-modified  | callcenter-worker & calendar-worker | changeMedium |
| ResourceEvent | consultation-module.master.indepth.patient-modified  | callcenter-worker & calendar-worker | changePatient |
| ResourceEvent | consultation-module.master.indepth.waiting-inconsultation | calendar-worker | Api.createNotify & Api.completeBeforeNotify |
| ResourceEvent | consultation-module.master.indepth.waiting-cancelled | calendar-worker | Api.cancelled & Api.createNotify |
| ResourceEvent | consultation-module.master.indepth.waiting-cancelled | FeeFactory | FeeFactory.cancel() |
| ResourceEvent | consultation-module.master.indepth.waiting-cancelled | ecommerce-worker | findOneAndUpdate |
| ResourceEvent | consultation-module.master.indepth.waiting-cancelled | callcenter-worker | findAndUpdate |
| ResourceEvent | consultation-module.master.indepth.waiting-rejected | calendar-worker | Api.cancelled & Api.createNotify |
| ResourceEvent | consultation-module.master.indepth.waiting-rejected | FeeFactory | FeeFactory.reject() |
| ResourceEvent | consultation-module.master.indepth.waiting-rejected | ecommerce-worker | findOneAndUpdate |
| ResourceEvent | consultation-module.master.indepth.waiting-rejected | callcenter-worker | findAndUpdate |
| ResourceEvent | consultation-module.master.indepth.inconsultation-completed | calendar-worker | Api.completed & Api.createNotify |
| ResourceEvent | consultation-module.master.indepth.inconsultation-completed | FeeFactory | FeeFactory.complete() |
| ResourceEvent | consultation-module.master.indepth.inconsultation-completed | ecommerce-worker | findOneAndUpdate |
| ResourceEvent | consultation-module.master.indepth.inconsultation-completed | callcenter-worker | findAndUpdate |
| ResourceEvent | consultation-module.master.indepth.inconsultation-free | calendar-worker | Api.completed & Api.createNotify |
| ResourceEvent | consultation-module.master.indepth.inconsultation-free | FeeFactory | FeeFactory.free() |
| ResourceEvent | consultation-module.master.indepth.inconsultation-free | ecommerce-worker | findOneAndUpdate |
| ResourceEvent | consultation-module.master.indepth.inconsultation-free | callcenter-worker | findAndUpdate |