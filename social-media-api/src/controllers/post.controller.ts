import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Database } from "../config/prisma";

class PostController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new Database().getInstance();
  }

  public all = async (req: Request, res: Response) => {
    try {
      const posts = await this.prisma.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: {
            where: { userId: Number(req.user?.id) },
            select: { id: true },
          },
        },
      });

      const data = posts.map((post) => ({
        ...post,
        isLiked: post.likes.length > 0,
      }));

      return res.json({
        status: 200,
        data,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public detail = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.postId);

      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      if (!post) {
        return res.status(404).send({
          status: 404,
          msg: "Postingan tidak ditemukan",
        });
      }

      return res.json({
        status: 200,
        data: post,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const { text, image } = req.body;

      if (!text) {
        return res.status(400).send({
          status: 400,
          msg: "Text wajib diisi",
        });
      }

      const newPost = await this.prisma.post.create({
        data: {
          text,
          image,
          userId: Number(req.user?.id),
        },
      });

      return res.json({
        status: 200,
        msg: "Berhasil membuat postingan",
        data: newPost,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { text, image } = req.body;

      const post = await this.prisma.post.findUnique({
        where: { id: Number(postId) },
      });

      if (!post) {
        return res.status(404).send({
          status: 404,
          msg: "Postingan tidak ditemukan",
        });
      }

      if (Number(req.user?.id) !== Number(post.userId)) {
        return res.status(400).send({
          status: 400,
          msg: "Tidak dapat rubah jika bukan creator",
        });
      }

      const updatedPost = await this.prisma.post.update({
        where: { id: Number(postId) },
        data: {
          text,
          image,
        },
      });

      return res.json({
        status: 200,
        msg: "Berhasil ubah postingan",
        data: updatedPost,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;

      const post = await this.prisma.post.findUnique({
        where: { id: Number(postId) },
      });

      if (!post) {
        return res.status(404).send({
          status: 404,
          msg: "Postingan tidak ditemukan",
        });
      }

      // Untuk periksa apakah user mempunyai akses untuk hapus
      if (Number(req.user?.id) !== post.userId) {
        return res.status(400).send({
          status: 400,
          msg: "Tidak bisa menghapus postingan jika bukan owner",
        });
      }

      const postDeleted = await this.prisma.post.delete({
        where: { id: Number(postId) },
      });

      return res.json({
        status: 200,
        msg: "Berhasil hapus postingan",
        data: postDeleted,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public createComment = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.postId);
      const { text } = req.body;

      if (!text) {
        return res.status(400).send({
          status: 400,
          msg: "User dan text wajib diisi",
        });
      }

      const post = await this.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).send({
          status: 404,
          msg: "Postingan tidak ditemukan",
        });
      }

      const comment = await this.prisma.comment.create({
        data: {
          text,
          userId: Number(req.user?.id),
          postId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.json({
        status: 200,
        msg: "Berhasil membuat komentar",
        data: comment,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public like = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.postId);
      const userId = Number(req.user?.id);

      const post = await this.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).send({
          status: 404,
          msg: "Postingan tidak ditemukan",
        });
      }

      const existingLike = await this.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      // Periksa apakah sudah like postingan atau belum
      if (existingLike) {
        // Hapus data like
        await this.prisma.like.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });

        return res.json({
          status: 200,
          msg: "Berhasil unlike postingan",
        });
      } else {
        // Buat like
        await this.prisma.like.create({
          data: {
            userId,
            postId,
          },
        });

        return res.json({
          status: 200,
          msg: "Berhasil menyukai postingan",
        });
      }
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };
}

export default PostController;
