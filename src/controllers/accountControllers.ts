import { Request, response, Response } from "express";
import { client } from "..";
import { toInteger } from "lodash";
import { generateAC } from "../utils/generateAccount";

export const createAccount = async (req: Request, res: Response) => {
  try {
    const id = toInteger((req.user as any).userId);

    const { type } = req.body;
    if (!type)
      return res
        .status(400)
        .json({ msg: "Incomplete information to open account" });
    const account = await client.account.create({
      data: {
        ownerid: id,
        acnumber: generateAC(),
        type: type,
      },
    });
    if (account) {
      return res
        .status(200)
        .json({ msg: "Account opened successfully", success: true, account });
    }
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ msg: "Internal server error", success: false });
  }
};
export const getAllAccounts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = toInteger((req.user as any).userId);
    const accounts = await client.account.findMany({
      where: {
        ownerid: id,
      },
    });
    return res.status(200).json({ msg: "Accounts fetched", accounts });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", success: false });
  }
};
