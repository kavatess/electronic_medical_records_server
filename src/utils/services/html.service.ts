import { Injectable } from "@nestjs/common";

@Injectable()
export class HtmlService {
  public removeHTMLTags(htmlText: string): string {
    let filteredStr = "";
    let isText = true;
    for (let i = 0; i < htmlText.length; i++) {
      const char = htmlText.charAt(i);
      if (char === "<") {
        isText = false;
        if (htmlText[i + 1] === "/") filteredStr += "\n";
      } else if (char === ">") isText = true;
      else if (isText) filteredStr += char;
    }
    return filteredStr;
  }
}
