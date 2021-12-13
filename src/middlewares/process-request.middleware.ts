import { NextFunction, Request, Response } from "express";
import * as _ from "lodash";

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function processRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // populating
  if (req.query.populate && isJsonString(req.query.populate.toString())) {
    req.query.populate = JSON.parse(req.query.populate.toString());
  } else if (
    req.query.populate &&
    !isJsonString(req.query.populate.toString()) &&
    !Array.isArray(req.query.populate)
  ) {
    req.query.populate = req.query.populate
      .toString()
      .split(" ")
      .map((i) => {
        // space to separate populate, dot to separate path vs select
        const select = i.split(".").slice(-1);
        const path = i.replace("." + select, "");
        return {
          path: path,
          select: _.replace(select + "", /,/g, " "),
        };
      });
  } else {
    req.query.populate = [];
  }
  // selecting fields
  if (req.query.fields)
    req.query.fields = req.query.fields
      .toString()
      .replace(/" "/g, "")
      .split(",")
      .join(" ");
  next();
}
