import { Request, Response } from "express";
import { toInteger } from "lodash";
import { client } from "..";
import { generateCardNumber, generateCVV, generateDateThreeYearsLater } from "../utils/cardUtils";

export const applyForCard = async (req: Request, res: Response) => {
  try {
    const userId = toInteger((req.user as any).userId);
    console.log(req.user);
    
    console.log(userId,typeof(userId));
    
    const { account, type } = req.body;
    if (!account || !type)
      return res.status(400).json({ msg: "Missing fields", success: false });
    const checkAccount = await client.account.findFirst({
      where: {
        acnumber: account,
      },
    });
    if (!checkAccount)
      return res.status(400).json({ msg: "Account not exists!", success: false });

    const card = await client.card.create({
      data: {
        cardNumber: generateCardNumber(),
        ownerid: userId,
        cvv: generateCVV(),
        expiration: generateDateThreeYearsLater(),
        type: type,
        accountId: account,
      },
    });
    if (card)
      return res
        .status(200)
        .json({ msg: "Applied for card successfully", card });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ msg: "Internal Server Error", success: false });
  }
};
