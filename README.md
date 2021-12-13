[![Drone](https://drone.wellcare.vn/api/badges/Wellcare/consultation-nestjs/status.svg?ref=refs/heads/master)](https://drone.wellcare.vn/Wellcare/consultation-nestjs)


# Getting started
- install dependencies: `yarn`
- start dependended services: `yarn start:infra`
- copy demo.env to .env and change your environments accordingly.
- start in development mode: `yarn dev`
- register superadmin user with this webhook http://localhost:8080/openapi/#/admin/AdminController_create 
- use the following admin user _id `5fc87b0ee383b0037c076ebb` and respective token `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHQiOiI1ZmM4N2IwZWUzODNiMDAzN2MwNzZlYmIiLCJpbmYiOnt9fQ.VlMv10J17JFusIuqwNPf3BVJT2NJJD2XClbk1KBowvA` in development mode.

# Contributing:
- This project use NestJs framework, follow its guideliness from here https://docs.nestjs.com/ 
- Within mHealth microservice framework, follow the following guidelines: https://github.com/Wellcare/documentation/tree/master/guideline.

