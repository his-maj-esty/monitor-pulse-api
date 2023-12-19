import axios, { AxiosResponse } from "axios";
import { dbService } from "../services/dbService";

export async function statusChecker() {
    const db = new dbService();
    const response = await db.getWebsites();
    console.log(response);

    response.map(async ({ url, name }) => {
      try {
        const res: AxiosResponse = await axios.get(url);
        const resCode = res.status;
        if (resCode == 200) {
          const response = await db.addStatus({ name: name, status: 1 });
          console.log("status of website : ", name, " is : ", resCode);
        } else {
          const response = await db.addStatus({ name: name, status: 0 });
          console.log("status of website : ", name, " is : ", resCode);
        }
      } catch (err) {
        const response = await db.addStatus({
          name: name,
          status: 0,
        });
        console.log("error for website :", name, " is :", err);
      }
    });
    
}