import { PrismaClient } from "@prisma/client";
import { Website, timeStats } from "../typings";

export class dbService {
  static client: PrismaClient;

  constructor() {
    if (dbService.client) {
      return;
    }
    dbService.client = new PrismaClient();
  }

  async addWebsite({ name, url }: Website): Promise<Website> {
    const res = await dbService.client.website.create({
      data: {
        name: name,
        url: url,
      },
    });
    return res;
  }

  async getStats({
    name,
  }: {
    name: string;
  }): Promise<({ stats: timeStats[] } & Website)[]> {
    const res = await dbService.client.website.findMany({
      where: {
        name: name,
      },
      select: {
        id: true,
        name: true,
        url: true,
        stats: {
          select: {
            status: true,
            timestamp: true,
          },
        },
      },
    });
    return res;
  }

  async getWebsites(): Promise<Website[]> {
    const res = await dbService.client.website.findMany({
      where: {},
    });
    return res;
  }

  async deleteWebsite({ name }: { name: string }): Promise<Website> {
    const res = await dbService.client.website.delete({
      where: {
        name: name,
      },
    });
    return res;
  }

  async addStatus({
    name,
    status,
  }: {
    name: string;
    status: number;
  }): Promise<Website> {
    const res = await dbService.client.website.update({
      where: {
        name: name,
      },
      data: {
        stats: {
          create: {
            status: status,
          },
        },
      },
    });
    return res;
  }
}
