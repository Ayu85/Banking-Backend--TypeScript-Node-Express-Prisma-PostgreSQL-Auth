import { Request, Response } from "express";
import { toInteger, toString } from "lodash";
import { client } from "..";

export const sendMoney = async (req: Request, res: Response) => {
  try {
    const { amount, description, toAccountId, fromAccountId } = req.body;
    const to = toInteger(toAccountId);
    const fromAccountInt = toInteger((req.user as any).userId);
    const fromAccountIdStr = toString((req.user as any).userId);
    if (!amount || !toAccountId)
      return res.status(400).json({ msg: "Missing fields", success: false });

    // Validate if the 'amount' is positive
    if (amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount", success: false });
    }
    // Check if both accounts exist
    const fromAccount = await client.account.findFirst({
      where: { acnumber: fromAccountId },
    });
    const toAccount = await client.account.findFirst({
      where: { acnumber: toAccountId },
    });
    // console.log(toAccount);

    if (!fromAccount || !toAccountId) {
      return res.status(400).json("One or both accounts do not exist");
    }

    // Ensure that the from account has sufficient balance
    if (fromAccount.balance < amount) {
      return res.status(400).json("Insufficient funds");
    }
    // Start transaction
    const result = await client.$transaction(async (client) => {
      // Debit from the sender account
      await client.account.update({
        where: { acnumber: fromAccountId },
        data: { balance: fromAccount.balance - amount },
      });

      // Credit to the recipient account
      await client.account.update({
        where: { acnumber: toAccountId },
        data: { balance: toAccount?.balance + amount },
      });

      // Optionally, record the transaction in a transaction history table
      const transaction = await client.transaction.create({
        data: {
          amount,
          description,
          fromAccountId: fromAccountId,
          toAccountId: toAccountId,
        },
      });
      return res.status(200).json({
        msg: "Transaction successful!!",
        success: true,
        data: transaction,
      });
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ msg: "Internal Server Error", success: false });
  }
};
export const fetchTransactions = async (req: Request, res: Response) => {
  try {
    const { fromAccountId } = req.body;
    const userID = toInteger((req.user as any).userId);
    const checkOwner = await client.account.findFirst({
      where: { ownerid: userID },
    });
    if (checkOwner?.acnumber !== fromAccountId)
      return res.status(400).json({ msg: "Unable to fetch", success: false });

    // Fetch transactions and include the owner's name of the receiving account (toAccountId)
    const transactions = await client.transaction.findMany({
      where: { fromAccountId: fromAccountId },
      include: {
        toAccount: {
          select: {
            owner: {
              select: {
                fullname: true, // Assuming the 'Customer' model has a 'fullname' field
              },
            },
          },
        },
      },
    });

    // Check if transactions were found
    if (transactions.length > 0) {
      return res.status(200).json({
        msg: "Transactions Fetched Successfully",
        success: true,
        transactions: transactions.map((transaction) => ({
          ...transaction,
          toAccountOwnerName: transaction.toAccount?.owner?.fullname, // Add owner's name to the response
        })),
      });
    } else {
      return res.status(404).json({
        msg: "No Transactions Found",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", success: false });
  }
};
