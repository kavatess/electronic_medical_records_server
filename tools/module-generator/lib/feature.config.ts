export const features = [
  {
    files: [
      "./controllers/employee.controller.ts",
      "./controllers/employee.custom.controller.ts",
      "./controllers/employee.linked-list.controller.ts",
    ],
    name: "controller"
  },
  {
    files: [
      "/dto/employee.dto.ts",
      "/dto/create-employee.dto.ts",
      "/dto/update-employee.dto.ts",
      "/dto/array-update-employee.dto.ts",
    ],
    name: "dto",
  },
  {
    files: ["employee.module.ts"],
    features: [
      "module",
      "schema.publish-queue",
      "schema.publish-local",
      "schema.publish-socket",
    ],
    name: "module",
  },
  { files: ["./schemas/employee.schema.ts"], name: "schema" },
  { files: ["employee.service.ts"], name: "service" },
  { files: ["employee.subscriber.ts"], name: "subscriber" },
];
