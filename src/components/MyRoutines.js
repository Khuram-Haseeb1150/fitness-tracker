import "./MyRoutines.css";
import { useState, useEffect } from "react";
import { getToken, getUsername } from "../auth";
import AddRoutineForm from "./AddRoutineForm";
import UpdateRoutineForm from "./UpdateRoutineForm";
import AddActivityForm from "./AddActivityForm";
import UpdateActivityForm from "./UpdateActivityForm";

const MyRoutines = ({ username, setUsername, authenticate }) => {
  const { REACT_APP_FITNESS_TRACKER_API_URL } = process.env;
  const [routines, setRoutines] = useState([]);
  const [activities, setActivities] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    const getUserAndSetRoutines = async () => {
      try {
        const responseUser = await getUsername();
        const { username } = await responseUser.json();
        setUsername(username);
        const responseRoutines = await fetch(
          `${REACT_APP_FITNESS_TRACKER_API_URL}api/users/${username}/routines`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const routines = await responseRoutines.json();
        console.log(routines);
        setRoutines([...routines]);
        setId(routines.id);
      } catch (error) {
        console.log(error);
      }
    };
    getUserAndSetRoutines();
  });

  const deleteRoutine = (id) => {
    const token = getToken();
    console.log(token, "THIS IS FROM DELETE FUNCTION");
    fetch(`${REACT_APP_FITNESS_TRACKER_API_URL}api/routines/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const newRoutines = routines.filter((routine) => {
          return routine.id !== id;
        });
        setRoutines(newRoutines);
        console.log(result);
      })
      .catch(console.error);
  };

  const deleteActivity = (id) => {
    const token = getToken();
    console.log(id);
    fetch(`${REACT_APP_FITNESS_TRACKER_API_URL}api/routine_activities/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const newActivities = routines.filter((routine) => {
          routine.activities.filter((activity) => {
            return activity.id !== id;
          });
        });
        setRoutines(newActivities);
      })
      .catch(console.error);
  };

  const currentDay = new Date().toLocaleDateString();

  return (
    <>
      {getToken() && authenticate ? (
        <>
          <div className="main-my-routines">
            <div className="my-routines-container">
              <div className="my-routines-header">
                <div className="user-welcome">
                  <h1>
                    {username}'s Workout Routines - {currentDay}
                  </h1>
                </div>
              </div>
              

              <div className="profile-body">
                <div className="my-routines-content">
                  {routines.map((routine, idx) => {
                    return (
                      <div key={idx} className="my-routines my-routines-card">
                        <h2>Routine: {routine.name}</h2>
                        <p>Goal: {routine.goal}</p>
                        {routine.activities ? (
                          <div>
                            {routine.activities.map((activity, index) => {
                              return (
                                <div key={index} className="activities-display">
                                  <div>
                                    <h3>Activity: {activity.name}</h3>
                                    <h3>Description: {activity.description}</h3>
                                    <h3>Count: {activity.count}</h3>
                                    <h3>Duration: {activity.duration}</h3>
                                  </div>
                                  <button
                                    className="my-routines-btn"
                                    onClick={() => deleteActivity(activity.id)}
                                  >
                                    Delete Activity
                                  </button>
                                  <UpdateActivityForm
                                    routines={routines}
                                    setRoutines={setRoutines}
                                    routineActivityId={activity.id}
                                    setActivities={setActivities}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                        <div className="buttons">
                          <button
                            className="my-routines-btn"
                            onClick={() => deleteRoutine(routine.id)}
                          >
                            Delete Routine
                          </button>
                          {
                            <>
                              <UpdateRoutineForm
                                authenticate={authenticate}
                                routines={routines}
                                setRoutines={setRoutines}
                                routineId={routine.id}
                              />
                              <AddActivityForm
                                id={id}
                                activities={activities}
                                setActivities={setActivities}
                                routineId={routine.id}
                                routines={routines}
                                setRoutines={setRoutines}
                              />
                            </>
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="my-routines-right">
                <div className="nav">
                  { getToken() ? (
                  <div className="nav"> 
                    <AddRoutineForm
                      authenticate={authenticate}
                      routines={routines}
                      setRoutines={setRoutines}
                    />
                  </div>
                ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="unauthenticatedProfile"> Login to access profile.</div>
      )}
    </>
  );
};

export default MyRoutines;
