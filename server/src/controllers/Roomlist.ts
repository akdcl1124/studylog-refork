import { Request, Response } from "express";
import models from "../models/Roomlist";

export default {
  get: (req: Request, res: Response) => {
    const { page, limit } = req.query;
    models.get((error, result) => {
      if (error) {
        res.status(500).json({ message: "Internal Sever Error" });
      } else {
        if (result.length === 0) {
          // DB에서 결과값이 없는 경우
          res.status(204).json({
            data: null,
            message: "공부방이 없습니다.",
          });
        } else {
          if (limit > result.length) {
            res.status(400).json({ message: `limit은 ${result.length} 이하여야 합니다.` });
          } else if (limit <= 0) {
            res.status(400).json({ message: "limit은 1 이상이어야 합니다." });
          } else {
            const totalRoomList = result.slice().filter((result) => result.roomCurrent > 0); // 방의 인원이 1명 이상인 경우에만 클라이언트로 응답
            const roomList = []; // 각 페이지가 보관 될 배열
            const totalPage = Math.ceil(totalRoomList.length / limit); // 배열의 갯수를 limit으로 나누어 전체 페이지 수를 결정!

            for (let i = 0; i < totalPage; i++) {
              roomList.push(totalRoomList.splice(0, limit));
            }
            // console.log(roomList)
            if (page > totalPage) {
              res.status(400).json({ message: `page는 ${totalPage} 이하여야 합니다.` });
            } else if (page <= 0) {
              res.status(400).json({ message: "page는 1 이상이어야 합니다." });
            } else {
              res.status(200).json({ data: roomList[page - 1], total: totalPage });
            }
          }
        }
      }
    });
  },
  delete: (req: Request, res: Response) => {
    const { roomId } = req.query;
    models.delete(Number(roomId), (error, result) => {
      if (error) {
        res.status(500).json({ message: "Internal Sever Error" });
      } else {
        res.status(200).json({ message: `${roomId} 삭제 완료했습니다.` });
      }
    });
  },
};
