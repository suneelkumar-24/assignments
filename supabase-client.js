/**
 * ===================================================================
 * TaskFlow Pro - Supabase Database Client & Authentication Layer
 * ===================================================================
 * Provides unified Supabase Cloud DB operations with automatic LocalStorage
 * fallback for offline resilience.
 */

(function () {
  // Default config key in LocalStorage
  const SUPABASE_CONFIG_STORAGE_KEY = "taskflow_supabase_config";
  const LOCAL_USERS_STORAGE_KEY = "taskflow_users_db";

  // Pre-configured / User Configurable Supabase credentials
  // Replace these defaults or set via UI Modal
  const DEFAULT_CONFIG = {
    url: "", // e.g. "https://xyzcompany.supabase.co"
    anonKey: "", // e.g. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  };

  let client = null;
  let isConnected = false;

  function loadConfig() {
    try {
      const stored = localStorage.getItem(SUPABASE_CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.url && parsed.anonKey) return parsed;
      }
    } catch (e) {
      console.warn("Could not read stored Supabase config:", e);
    }
    return DEFAULT_CONFIG;
  }

  function initClient() {
    const config = loadConfig();
    if (window.supabase && config.url && config.anonKey) {
      try {
        client = window.supabase.createClient(config.url, config.anonKey);
        isConnected = true;
        return client;
      } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
        client = null;
        isConnected = false;
      }
    }
    return null;
  }

  // Baseline mock users if local fallback is active
  const FALLBACK_BASELINE_USERS = [
    { username: "admin", password: "admin123", name: "Super Administrator", role: "admin", createdAt: "2026-08-21" },
    { username: "papu", password: "umerkot123", name: "Papu", role: "student", createdAt: "2026-08-21" },
    { username: "motiram", password: "umerkot123", name: "Motiram", role: "student", createdAt: "2026-08-21" },
    { username: "saqib", password: "sug99", name: "Saqib", role: "student", createdAt: "2026-08-21" },
    { username: "lajpat", password: "lajpatrai", name: "Lajpat", role: "student", createdAt: "2026-08-21" },
    { username: "dileep", password: "dileep123", name: "Dileep", role: "student", createdAt: "2026-08-21" },
    { username: "zahid", password: "mirporkhas123", name: "Zahid", role: "student", createdAt: "2026-08-21" },
    { username: "chander", password: "asdf1234", name: "Chander", role: "student", createdAt: "2026-08-21" },
    { username: "darshan", password: "asdf1234", name: "Darshan", role: "student", createdAt: "2026-08-21" },
    { username: "farhan", password: "asdf1234", name: "Farhan", role: "student", createdAt: "2026-08-21" }
  ];

  function getLocalUsers() {
    try {
      const raw = localStorage.getItem(LOCAL_USERS_STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) return list;
      }
    } catch (e) {}
    localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(FALLBACK_BASELINE_USERS));
    return FALLBACK_BASELINE_USERS;
  }

  function saveLocalUsers(list) {
    localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(list));
  }

  // ==================== TASKFLOW DB API ====================
  const TaskFlowDB = {
    init: initClient,

    getConfig() {
      return loadConfig();
    },

    saveConfig(url, anonKey) {
      const cleanUrl = (url || "").trim();
      const cleanKey = (anonKey || "").trim();
      if (!cleanUrl || !cleanKey) {
        localStorage.removeItem(SUPABASE_CONFIG_STORAGE_KEY);
        client = null;
        isConnected = false;
        return false;
      }
      localStorage.setItem(
        SUPABASE_CONFIG_STORAGE_KEY,
        JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
      );
      return initClient() !== null;
    },

    isCloudActive() {
      if (!client) initClient();
      return client !== null;
    },

    async testConnection() {
      if (!client) initClient();
      if (!client) return { success: false, message: "Supabase credentials not configured." };
      try {
        const { data, error } = await client.from("users").select("count", { count: "exact", head: true });
        if (error) throw error;
        return { success: true, message: "Connected to Supabase successfully!" };
      } catch (err) {
        return { success: false, message: err.message || "Failed to query Supabase." };
      }
    },

    // ---------- USER AUTHENTICATION ----------
    async login(username, password) {
      const cleanUser = (username || "").trim().toLowerCase();
      const cleanPass = (password || "").trim();

      if (!cleanUser || !cleanPass) {
        return { success: false, message: "Please enter username and password." };
      }

      // Try Supabase Cloud first
      if (client) {
        try {
          const { data, error } = await client
            .from("users")
            .select("id, username, password, name, role, created_at, last_login")
            .eq("username", cleanUser)
            .single();

          if (!error && data) {
            if (data.password === cleanPass) {
              // Update last_login in background
              client
                .from("users")
                .update({ last_login: new Date().toISOString() })
                .eq("username", cleanUser)
                .then(() => {});

              // Record login history
              this.recordLoginHistory(cleanUser);

              return {
                success: true,
                user: {
                  id: data.id,
                  username: data.username,
                  name: data.name || data.username,
                  role: data.role || "student",
                  createdAt: data.created_at,
                  source: "supabase",
                },
              };
            } else {
              return { success: false, message: "Invalid password." };
            }
          }
        } catch (cloudErr) {
          console.warn("Supabase login query failed, checking local database:", cloudErr);
        }
      }

      // Fallback to LocalStorage
      const localUsers = getLocalUsers();
      const matched = localUsers.find(
        (u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass
      );
      if (matched) {
        this.recordLoginHistory(cleanUser);
        return {
          success: true,
          user: {
            username: matched.username,
            name: matched.name || matched.username,
            role: matched.role || "student",
            createdAt: matched.createdAt || "2026-08-21",
            source: "local",
          },
        };
      }

      return { success: false, message: "Invalid username or password." };
    },

    // ---------- STUDENT SIGNUP / REGISTRATION ----------
    async signup({ username, password, name, role = "student" }) {
      const cleanUser = (username || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      const cleanPass = (password || "").trim();
      const cleanName = (name || "").trim() || cleanUser;

      if (!cleanUser || cleanUser.length < 2) {
        return { success: false, message: "Username must be at least 2 characters (letters, numbers, underscores)." };
      }
      if (!cleanPass || cleanPass.length < 3) {
        return { success: false, message: "Password must be at least 3 characters long." };
      }

      // Try Supabase Cloud
      if (client) {
        try {
          // Check if username exists
          const { data: existing, error: checkErr } = await client
            .from("users")
            .select("username")
            .eq("username", cleanUser)
            .maybeSingle();

          if (existing) {
            return { success: false, message: `Username "@${cleanUser}" is already registered.` };
          }

          const { data, error: insertErr } = await client
            .from("users")
            .insert([
              {
                username: cleanUser,
                password: cleanPass,
                name: cleanName,
                role: role,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (insertErr) throw insertErr;

          // Also keep local cache in sync
          const localUsers = getLocalUsers();
          if (!localUsers.find((u) => u.username === cleanUser)) {
            localUsers.push({
              username: cleanUser,
              password: cleanPass,
              name: cleanName,
              role: role,
              createdAt: new Date().toISOString().substring(0, 10),
            });
            saveLocalUsers(localUsers);
          }

          this.recordLoginHistory(cleanUser);

          return {
            success: true,
            user: {
              id: data.id,
              username: data.username,
              name: data.name,
              role: data.role,
              createdAt: data.created_at,
              source: "supabase",
            },
            message: "Student registered successfully in Supabase!",
          };
        } catch (cloudErr) {
          console.warn("Supabase signup failed, falling back to local:", cloudErr);
        }
      }

      // Local storage signup fallback
      const localUsers = getLocalUsers();
      if (localUsers.find((u) => u.username.toLowerCase() === cleanUser)) {
        return { success: false, message: `Username "@${cleanUser}" is already taken.` };
      }

      const newUser = {
        username: cleanUser,
        password: cleanPass,
        name: cleanName,
        role: role,
        createdAt: new Date().toISOString().substring(0, 10),
      };
      localUsers.push(newUser);
      saveLocalUsers(localUsers);
      this.recordLoginHistory(cleanUser);

      return {
        success: true,
        user: newUser,
        message: "Account created successfully (Local Storage mode).",
      };
    },

    // ---------- LOGIN HISTORY LOGS ----------
    async recordLoginHistory(username) {
      const uAgent = navigator.userAgent || "Unknown Device";
      if (client) {
        try {
          await client.from("login_history").insert([
            {
              username: username,
              login_at: new Date().toISOString(),
              user_agent: uAgent,
            },
          ]);
        } catch (e) {
          console.warn("Failed to record login history in Supabase:", e);
        }
      }

      // Record in local storage as well
      try {
        const key = `taskflow_login_logs`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.unshift({
          username: username,
          login_at: new Date().toISOString(),
          user_agent: uAgent,
        });
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 100)));
      } catch (e) {}
    },

    async getLoginHistory(limit = 50) {
      if (client) {
        try {
          const { data, error } = await client
            .from("login_history")
            .select("*")
            .order("login_at", { ascending: false })
            .limit(limit);
          if (!error && data) return data;
        } catch (e) {
          console.warn("Failed to fetch login history from Supabase:", e);
        }
      }
      try {
        const localLogs = JSON.parse(localStorage.getItem("taskflow_login_logs") || "[]");
        return localLogs.slice(0, limit);
      } catch (e) {
        return [];
      }
    },

    // ---------- TASK PROGRESS (COMPLETED ASSIGNMENTS) ----------
    async getUserProgress(username) {
      const cleanUser = (username || "").toLowerCase();
      let progressMap = {};

      // 1. Fetch from Supabase
      if (client) {
        try {
          const { data, error } = await client
            .from("task_progress")
            .select("task_id, is_completed")
            .eq("username", cleanUser)
            .eq("is_completed", true);

          if (!error && Array.isArray(data)) {
            data.forEach((row) => {
              progressMap[row.task_id] = true;
            });
            // Update local storage mirror
            localStorage.setItem(`taskflow_progress_${cleanUser}`, JSON.stringify(progressMap));
            return progressMap;
          }
        } catch (e) {
          console.warn("Failed to fetch user progress from Supabase, using local cache:", e);
        }
      }

      // 2. Fallback to LocalStorage
      try {
        const localRaw = localStorage.getItem(`taskflow_progress_${cleanUser}`);
        if (localRaw) {
          progressMap = JSON.parse(localRaw) || {};
        }
      } catch (e) {}

      return progressMap;
    },

    async setTaskProgress(username, taskId, category, isCompleted, taskName = "") {
      const cleanUser = (username || "").toLowerCase();

      // Update local storage mirror immediately for instant UI responsiveness
      try {
        const localKey = `taskflow_progress_${cleanUser}`;
        let localProgress = JSON.parse(localStorage.getItem(localKey) || "{}");
        if (isCompleted) {
          localProgress[taskId] = true;
        } else {
          delete localProgress[taskId];
        }
        localStorage.setItem(localKey, JSON.stringify(localProgress));
      } catch (e) {}

      // Sync with Supabase in background
      if (client) {
        try {
          if (isCompleted) {
            await client.from("task_progress").upsert(
              {
                username: cleanUser,
                task_id: taskId,
                category: category || "general",
                is_completed: true,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "username,task_id" }
            );
          } else {
            await client
              .from("task_progress")
              .delete()
              .eq("username", cleanUser)
              .eq("task_id", taskId);
          }

          // Record action in task_history table
          await client.from("task_history").insert([
            {
              username: cleanUser,
              task_id: taskId,
              task_name: taskName || taskId,
              category: category || "general",
              action: isCompleted ? "completed" : "uncompleted",
              created_at: new Date().toISOString(),
            },
          ]);
        } catch (e) {
          console.warn("Supabase task progress sync error:", e);
        }
      }

      // Also record local task history
      try {
        const histKey = `taskflow_history_${cleanUser}`;
        let hist = JSON.parse(localStorage.getItem(histKey) || "[]");
        hist.unshift({
          task_id: taskId,
          task_name: taskName || taskId,
          category: category || "general",
          action: isCompleted ? "completed" : "uncompleted",
          created_at: new Date().toISOString(),
        });
        localStorage.setItem(histKey, JSON.stringify(hist.slice(0, 200)));
      } catch (e) {}

      return true;
    },

    async resetUserProgress(username) {
      const cleanUser = (username || "").toLowerCase();

      // Clear local
      localStorage.removeItem(`taskflow_progress_${cleanUser}`);

      // Clear Supabase
      if (client) {
        try {
          await client.from("task_progress").delete().eq("username", cleanUser);

          await client.from("task_history").insert([
            {
              username: cleanUser,
              task_id: "ALL_TASKS",
              task_name: "Reset All Assignments Progress",
              category: "system",
              action: "reset",
              created_at: new Date().toISOString(),
            },
          ]);
        } catch (e) {
          console.warn("Supabase progress reset failed:", e);
        }
      }
      return true;
    },

    // ---------- TASK HISTORY TIMELINE ----------
    async getStudentTaskHistory(username, limit = 100) {
      const cleanUser = (username || "").toLowerCase();

      if (client) {
        try {
          let query = client.from("task_history").select("*").order("created_at", { ascending: false }).limit(limit);
          if (cleanUser && cleanUser !== "all") {
            query = query.eq("username", cleanUser);
          }
          const { data, error } = await query;
          if (!error && data) return data;
        } catch (e) {
          console.warn("Failed to fetch task history from Supabase:", e);
        }
      }

      try {
        const histKey = `taskflow_history_${cleanUser}`;
        return JSON.parse(localStorage.getItem(histKey) || "[]").slice(0, limit);
      } catch (e) {
        return [];
      }
    },

    // ---------- CHANGE PASSWORD ----------
    async changePassword(username, oldPassword, newPassword) {
      const cleanUser = (username || "").toLowerCase();

      if (client) {
        try {
          const { data: user, error: fetchErr } = await client
            .from("users")
            .select("password")
            .eq("username", cleanUser)
            .single();

          if (!fetchErr && user) {
            if (user.password !== oldPassword) {
              return { success: false, message: "Current password is incorrect." };
            }
            const { error: updateErr } = await client
              .from("users")
              .update({ password: newPassword })
              .eq("username", cleanUser);

            if (updateErr) throw updateErr;

            // Also update local cache
            const localUsers = getLocalUsers();
            const localObj = localUsers.find((u) => u.username === cleanUser);
            if (localObj) {
              localObj.password = newPassword;
              saveLocalUsers(localUsers);
            }

            return { success: true, message: "Password updated successfully in Supabase!" };
          }
        } catch (e) {
          console.warn("Supabase password update failed, falling back to local:", e);
        }
      }

      const localUsers = getLocalUsers();
      const localObj = localUsers.find((u) => u.username === cleanUser);
      if (!localObj || localObj.password !== oldPassword) {
        return { success: false, message: "Current password is incorrect." };
      }
      localObj.password = newPassword;
      saveLocalUsers(localUsers);
      return { success: true, message: "Password updated in local storage." };
    },

    // ---------- ADMIN: ALL STUDENTS WITH PROGRESS ----------
    async getAllStudentsWithProgress(totalTaskCount = 243) {
      let users = [];

      // 1. Fetch users from Supabase
      if (client) {
        try {
          const { data, error } = await client
            .from("users")
            .select("id, username, password, name, role, created_at, last_login")
            .order("id", { ascending: true });

          if (!error && Array.isArray(data) && data.length > 0) {
            users = data;
          }
        } catch (e) {
          console.warn("Supabase users list fetch failed:", e);
        }
      }

      if (users.length === 0) {
        users = getLocalUsers();
      }

      // 2. Fetch all completed task counts
      let progressCounts = {};
      if (client) {
        try {
          const { data: progData, error: progErr } = await client
            .from("task_progress")
            .select("username")
            .eq("is_completed", true);

          if (!progErr && Array.isArray(progData)) {
            progData.forEach((row) => {
              const u = row.username.toLowerCase();
              progressCounts[u] = (progressCounts[u] || 0) + 1;
            });
          }
        } catch (e) {}
      }

      return users.map((u) => {
        const username = u.username.toLowerCase();
        let completedCount = progressCounts[username];

        if (completedCount === undefined) {
          // Check local storage progress
          try {
            const raw = localStorage.getItem(`taskflow_progress_${username}`);
            if (raw) {
              const map = JSON.parse(raw);
              completedCount = Object.keys(map).filter((k) => map[k] === true).length;
            } else {
              completedCount = 0;
            }
          } catch (e) {
            completedCount = 0;
          }
        }

        const percentage = Math.min(100, Math.round((completedCount / totalTaskCount) * 100));

        return {
          id: u.id,
          username: u.username,
          password: u.password,
          name: u.name || u.username,
          role: u.role || "student",
          createdAt: (u.created_at || u.createdAt || "2026-08-21").substring(0, 10),
          lastLogin: u.last_login || null,
          completedCount: completedCount,
          percentage: percentage,
        };
      });
    },

    // ---------- ADMIN: DELETE STUDENT ----------
    async deleteStudent(username) {
      const cleanUser = (username || "").toLowerCase();

      if (client) {
        try {
          await client.from("users").delete().eq("username", cleanUser);
          await client.from("task_progress").delete().eq("username", cleanUser);
          await client.from("task_history").delete().eq("username", cleanUser);
        } catch (e) {
          console.warn("Supabase student delete failed:", e);
        }
      }

      const localUsers = getLocalUsers().filter((u) => u.username !== cleanUser);
      saveLocalUsers(localUsers);
      localStorage.removeItem(`taskflow_progress_${cleanUser}`);
      localStorage.removeItem(`taskflow_history_${cleanUser}`);
      return true;
    },

    // ---------- ADMIN: UPDATE STUDENT ----------
    async updateStudent(username, { name, password, role }) {
      const cleanUser = (username || "").toLowerCase();

      if (client) {
        try {
          const updates = {};
          if (name !== undefined) updates.name = name;
          if (password !== undefined) updates.password = password;
          if (role !== undefined) updates.role = role;

          const { error } = await client.from("users").update(updates).eq("username", cleanUser);
          if (error) throw error;
        } catch (e) {
          console.warn("Supabase student update error:", e);
        }
      }

      const localUsers = getLocalUsers();
      const user = localUsers.find((u) => u.username === cleanUser);
      if (user) {
        if (name !== undefined) user.name = name;
        if (password !== undefined) user.password = password;
        if (role !== undefined) user.role = role;
        saveLocalUsers(localUsers);
      }
      return true;
    },
  };

  // Expose globally
  window.TaskFlowDB = TaskFlowDB;

  // Auto initialize
  document.addEventListener("DOMContentLoaded", () => {
    TaskFlowDB.init();
  });
})();
