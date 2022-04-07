import React, { useEffect, useRef, useState } from 'react';
import '../../css/ProjectPage.css';
import ProjectAddPage from '../ProjectAddPage/ProjectAddPage';
import Sidebar from '../SideBar/SideBar';
import Notification from '../Notification/Notification';
import profile from '../../images/profile.png';
import bell from '../../images/bell.png';
import square from '../../images/square.png';
import box from '../../images/box.png';
import { Row, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { myInfo, projectData } from '../../../_actions/user_action';

/*프로젝트 페이지로 넘어가면 나오는 페이지*/
const ProjectPage = () =>{
    const dispatch = useDispatch<any>();
    let pr_cnt:number = 0;
    let today = new Date(); //날짜를 계산해주는 Date 함수
    let year = today.getFullYear(); // 현재 년도를 가져와주는 getFullYear 함수
    let month = today.getMonth() + 1; // 현재 월을 가져와주는 getMonth 함수
    let date = today.getDate(); //현재 일을 가져와주는 getDate 함수
    
  const [subject, setsubject] = useState("프로젝트 페이지");
  const [proModal, setproModal] = useState(false);
  const [notiModal, setNotiModal] = useState(false);
  const [num, setNum] = useState(0)
  const [Id, setId] = useState(0)


const [projects_list, setproject] = useState<any>(
    [{
    pr_dataid : null,
    pr_id : null,
    pr_name : null, 
    pr_de : null,
    pr_date : null,
    pr_category : null,
    pr_upload : null,
    pr_token : null
    }]
    )

    var token_name = 'x_auth'
    token_name = token_name + '='; 
    var cookieData = document.cookie; 
    var start = cookieData.indexOf(token_name);
    let token = ''; 
    if(start != -1){
         start += token_name.length; 
         var end = cookieData.indexOf(';', start); 
         if(end == -1) end = cookieData.length; 
         token = cookieData.substring(start, end);
  }
  let body = {
    token : token
  }
  useEffect(()=> {
   
    dispatch(myInfo(body))
  .then((response: { payload: { Success: any; id : number;} }) => {
    if(response.payload.Success) {
        // 내 id값 
        setId(response.payload.id);
        console.log('id값',response.payload.id)
    }  
    else {
      alert('아이디 가져오기 실패')

    }
  }) },[Id])
  let bodys = {
    id : Id
}
    // ㄴㅐ id값을 넘겨줘야함
    useEffect(()=> {
       
        console.log('body', bodys)
    dispatch(projectData(bodys))
    .then((response: { payload: { success: any; project : any}; }) => {
        console.log(response.payload.project)
        console.log(response.payload.success)
      if(response.payload.success) {
        const Data = response.payload.project.map(
            (data: {info : String, name: String, _id:any, date: String, tool : String, category:String, upload  :String, token : String}, id : number) => ({
                   pr_dataid : data._id,
                   pr_id : id ,
                   pr_name : data.name,
                   pr_de : data.info,
                   pr_date : data.date,
                   pr_tool : data.tool,
                   pr_category : data.category,
                   pr_upload : data.upload,
                   pr_token : data.token,
            })
        )
        setproject(projects_list.concat(Data))
        // response.payload.project
        // setproject({projects_list})
        // console.log(response.payload.project)
        // setproject({projects_list})
        // console.log(response.payload.project)
      }
      else {
        alert('실패')
      }
     })
    },[Id])

  const nextId = projects_list.length // list 개수
  console.log('next',nextId)
  const getName = (user:any) => {
    setproject ([...projects_list, user])
  }

  // 프로젝트 목록에서 한줄 클릭하면 그 줄에 해당하는 페이지로 이동시키기 위한 onclick 이벤트
  const navigate = useNavigate();
  const handleRowClick = (name: any,id : any ) => {
      console.log(name)
      console.log(id)
      navigate(`/ProjectPage/${name}/${id}`)
  }
 //  <Test projects_list = {projects_list} />
  return(
   <div>
   <nav className="sidebar">
   <Sidebar projects_list = {projects_list} >
   </Sidebar>
   </nav>
        <header>
            <title>프로젝트 페이지</title>
            </header>
                <body  className="view">
                    <div className="view_header">
                    <h2 className="dashboard" >{subject}</h2>
                   {/* <Link to = "/MyProfile">
                    <button  className="logout"><img className="icon" src={profile}></img></button>

  </Link>*/}
                    <button  className="logout" onClick={() => setNotiModal(true)}><img className="icon" src={bell}></img></button>
                    <Notification show = {notiModal} getName={getName} nextId = {nextId} onHide ={()=>setNotiModal(false)}/>
                    <ProjectAddPage show ={proModal} getName={getName} nextId = {nextId} onHide={()=>setproModal(false)} />
                     <input className="pro_search" placeholder='프로젝트 검색'></input>
                    <button className="pr_add_btn" onClick={ ()=>setproModal(true)} >프로젝트 생성 </button> 
                     </div>
                    <div className="tables">               
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>프로젝트 번호</th>
                                    <th>프로젝트 명</th>
                                    <th>카테고리</th>
                                    <th>업로드 타입</th>
                                    <th>생성일</th>
                                    <th>프로젝트 설명</th>
                                </tr>
                            </thead>
                            <tbody id="tables">
                                {
                                    projects_list?.map(
                                        (project: {pr_dataid : any ,pr_id : String, pr_name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal  | undefined; pr_category: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal  | undefined; pr_upload: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal  | undefined;  pr_date: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal  | undefined; pr_de: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal  | undefined; } ,num: number) => (
                                                (project.pr_id !== null) ?
                                                (
                                            <tr onClick={()=> handleRowClick(project.pr_name,project.pr_dataid )}>
                                            <td>{num}</td>
                                            <td>{project.pr_name}</td>
                                            <td>{project.pr_category}</td>
                                            <td>{project.pr_upload}</td>
                                            <td>{project.pr_date}</td>
                                            <td>{project.pr_de}</td>
                                            </tr>
                                                ) : (
                                                 <tr >
                                                </tr>
                                                ) 
                                            
                                        )
                                    )
                                }
    
                               {/* {
                                    projects_list.pr_name != null ? (
                                    <>
                                    <td></td>
                                    <td>{projects_list.pr_name}</td>
                                    <td>{projects_list?.pr_tool}</td>
                                    <td>{projects_list?.pr_date}</td>
                                    <td>{projects_list?.pr_de}</td>
                                    </>
                                ) :
                                (
                                   <>
                                   </>
                                )
                                }*/}
                            </tbody>
                        </Table>
                    </div>
                </body> 
            <footer>
        </footer>
    </div>
  );
}

export default ProjectPage;