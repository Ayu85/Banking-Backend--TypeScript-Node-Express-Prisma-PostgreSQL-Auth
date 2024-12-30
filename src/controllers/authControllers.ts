import { client } from '..'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { toInteger } from 'lodash'
export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { fullname, password, contact, email } = req.body
    if (!fullname || !password || !contact || !email)
      return res.status(400).json({ msg: 'Missing fields', success: false })
    const doesCustomerExists = await client.customer.findFirst({
      where: {
        email: email
      }
    })

    if (doesCustomerExists)
      return res
        .status(400)
        .json({ msg: 'User already exists', success: false })

    const passwordHash = await bcrypt.hash(password, 10)
    const newCustomer = await client.customer.create({
      data: {
        fullname,
        password: passwordHash,
        contact,
        email
      }
    })

    if (newCustomer) {
      const { password, ...customerWithoutPassword } = newCustomer
      return res.status(200).json({
        msg: 'User created successfully',
        success: true,
        customer: customerWithoutPassword
      })
    }
    return res.status(500).json({ msg: 'Unexpected error occurred' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Internal server error' })
  }
}
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log(req.body)

    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ msg: 'Missing fields', success: false })
    const user = await client.customer.findFirst({
      where: {
        email: email
      }
    })
    // console.log(user);

    if (!user)
      return res.status(404).json({ msg: 'User not found', success: false })
    const matchPassword = await bcrypt.compare(password, user.password)
    if (matchPassword) {
      const secret = process.env.JWT_SECRET

      if (!secret) {
        return res.status(500).json({
          msg: 'JWT Secret is not configured',
          success: false
        })
      }
      const token = jwt.sign(
        { userId: user.custid } as jwt.JwtPayload,
        secret,
        { expiresIn: '1h' }
      )
      const { password, ...customerWithoutPassword } = user
      return res.cookie('token', token, { httpOnly: true }).status(200).json({
        msg: 'Login successs',
        success: true,
        user: customerWithoutPassword
      })
    }
    return res.status(404).json({ msg: 'Invalid Password', success: false })
  } catch (error) {
    return res
      .status(200)
      .json({ msg: 'Internal Server Error', success: false })
  }
}
export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    return res.cookie('token', '').status(200).json('Logged out successfully')
  } catch (error) {
    return res
      .status(500)
      .json({ msg: 'Internal Server Error', success: false })
  }
}
export const checkAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userID = toInteger((req.user as any).userId)
    const user = await client.customer.findFirst({
      where: {
        custid: userID
      },
      select: {
        custid: true,
        fullname: true,
        email: true,
        contact: true
      }
    })
    return res.status(200).json({ success: true, user })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: 'Internal Server Error', success: false })
  }
}
