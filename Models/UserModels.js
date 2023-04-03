const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcrypt");
const { sendMail, generateToken } = require("../utils/AuthUtils");
const jwt = require("jsonwebtoken");
let User = class {
  constructor({ name, username, email, password, phone }) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.name = name;
    this.phone = phone;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      this.hashedPass = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT)
      );

      const newUser = new UserSchema({
        username: this.username,
        name: this.name,
        email: this.email,
        password: this.hashedPass,
        phone: this.phone,
      });
      let isUser;
      let verificationToken = generateToken(this.email);
      try {
        isUser = await UserSchema.findOne({ email: this.email });
        if (isUser) {
          throw Error("User already exists");
        }
        if (!isUser) {
          try {
            const result = await newUser.save();
            sendMail(this.email, verificationToken);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      } catch (error) {
        reject(error);
      }
      return;
    });
  }

  static loginUser({ loginId, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            if (!user.emailAuthenticated) {
              throw Error("Please verify your email before login");
            } else {
              resolve(user);
            }
          } else {
            throw Error("Incorrect Password");
          }
        } else {
          throw Error("User not found");
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  static verifyUser(token) {
    return new Promise(async (resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedData) => {
        if (err) {
          return reject(err);
        }
        console.log({ decodedData });
        try {
          const userDb = await UserSchema.findOneAndUpdate(
            { email: decodedData.email },
            { emailAuthenticated: true }
          );
          console.log(
            "🚀 ~ file: UserModels.js:89 ~ jwt.verify ~ userDb:",
            userDb
          );
          resolve(userDb); // redirect page
        } catch (error) {
          reject("Invalid Authentication Link");
        }
      });
    });
  }
  static resetPass(token) {
    return new Promise(async (resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedData) => {
        if (err) {
          return reject(err);
        }
        try {
          const userDb = await UserSchema.findOne(
            { email: decodedData.email },
            { resetPass: true }
          );
          resolve(userDb); // redirect page
        } catch (error) {
          reject("Invalid Authentication Link");
        }
      });
    });
  }
  static updatePass({ loginId, password }) {
    return new Promise(async (resolve, reject) => {
      let hashedPass = await bcrypt.hash(password, parseInt(process.env.SALT));
      try {
        const userDb = await UserSchema.findOneAndUpdate(
          { email: loginId },
          { password: hashedPass }
        );
        resolve(userDb); // redirect page
      } catch (error) {
        reject("Invalid Authentication Link");
      }
    });
  }

  static async userExists(email) {
    try {
      let isUser = await UserSchema.findOne({ email: email });
      return Boolean(isUser);
    } catch (error) {
      throw Error(error);
    }
  }
  static resendMail(email) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userExists(email);
        if (user) {
          let verificationToken = generateToken(this.email);
          sendMail(email, verificationToken);
          resolve("Mail sent successfully");
        } else {
          throw Error("User not found");
        }
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
