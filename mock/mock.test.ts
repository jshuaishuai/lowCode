import {Request,Response} from 'umi'

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  export default {
      'get /api/index': async (req:Request, res:Response) => {
        await waitTime(2000);
        res.json({
            code: 200,
            success:true,
            list:[{name:'jason',id:1}]
        })
      }
  }
