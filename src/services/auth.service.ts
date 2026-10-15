import { mockClient } from "@/lib/axios";
import { T_User } from "@/types";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

type AuthInput = {
  email: string;
  pass: string;
};

type TokenPayload = JwtPayload & {
  id: string;
};

export class AuthError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

const ACCESS_TOKEN_TTL: SignOptions["expiresIn"] = "15m";
const REFRESH_TOKEN_TTL: SignOptions["expiresIn"] = "360d";

const getSecret = (name: "JWT_SECRET" | "REFRESH_JWT_SECRET"): string => {
  const secret = process.env[name];
  if (!secret) throw new Error(`${name} is not configured`);
  return secret;
};

const createAccessToken = (user: T_User): string =>
  jwt.sign({ id: user.id }, getSecret("JWT_SECRET"), {
    expiresIn: ACCESS_TOKEN_TTL,
  });

const createRefreshToken = (user: T_User): string =>
  jwt.sign({ id: user.id }, getSecret("REFRESH_JWT_SECRET"), {
    expiresIn: REFRESH_TOKEN_TTL,
  });

const listUsers = async (): Promise<T_User[]> => {
  const response = await mockClient.get<T_User[] | { data: T_User[] }>(
    "/users",
  );
  const users = Array.isArray(response) ? response : response?.data;

  if (!Array.isArray(users))
    throw new Error("User service returned an invalid response");
  return users;
};

const findUserByEmail = async (email: string): Promise<T_User | undefined> => {
  const users = await listUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

const findUserById = async (id: string): Promise<T_User | undefined> => {
  const users = await listUsers();
  return users.find((user) => user.id === id);
};

const toPublicUser = ({ pass: _pass, ...user }: T_User): Omit<T_User, "pass"> =>
  user;

const createSession = (user: T_User) => ({
  user: toPublicUser(user),
  accessToken: createAccessToken(user),
  refreshToken: createRefreshToken(user),
});

const validateInput = (input: AuthInput): AuthInput => {
  const email =
    typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
  const pass = typeof input?.pass === "string" ? input.pass : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log("lỗi email", email);
    throw new AuthError("Vui lòng nhập email hợp lệ", 400);
  }
  if (pass.length < 6 || pass.length > 72) {
    console.log("lỗi password", pass);
    throw new AuthError("Mật khẩu cần có từ 8 đến 72 ký tự", 400);
  }

  return { email, pass };
};

const register = async (input: AuthInput) => {
  const { email, pass: password } = validateInput(input);
  if (await findUserByEmail(email)) {
    throw new AuthError("Email này đã được đăng ký", 409);
  }

  const name = email.split("@")[0];
  const passwordHash = await bcrypt.hash(password, 12);
  const user: T_User | null = await mockClient.post("/users", {
    name,
    email,
    pass: passwordHash,
    avatar: "https://picsum.photos/360/360",
  });

  if (!user?.id || !user.email || !user.pass) {
    throw new Error("User service did not return the created user");
  }
  return createSession(user);
};

const login = async (input: AuthInput) => {
  const { email, pass } = validateInput(input);
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(pass, user.pass))) {
    throw new AuthError("Email hoặc mật khẩu không đúng", 401);
  }
  return createSession(user);
};

const verifyRefreshToken = (token: string): Promise<TokenPayload> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, getSecret("REFRESH_JWT_SECRET"), (error, decoded) => {
      if (
        error ||
        decoded === null ||
        typeof decoded !== "object" ||
        typeof decoded.id !== "string"
      ) {
        reject(
          new AuthError("Phiên đăng nhập không hợp lệ hoặc đã hết hạn", 401),
        );
        return;
      }
      resolve(decoded as TokenPayload);
    });
  });

const refreshToken = async (token: string) => {
  if (!token) throw new AuthError("Cần đăng nhập để tiếp tục", 401);

  const payload = await verifyRefreshToken(token);
  const user = await findUserById(payload.id);
  if (!user) throw new AuthError("Tài khoản không còn tồn tại", 401);
  return createSession(user);
};

const profile = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) throw new AuthError("Tài khoản không còn tồn tại", 401);
  return toPublicUser(user);
};

const authService = { login, register, refreshToken, profile };

export default authService;
