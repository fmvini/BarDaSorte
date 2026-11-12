import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Icon } from "../Icons.jsx";
import { useFavorites } from "../../hooks/useFavorites.js";
import { usePantry } from "../../hooks/usePantry.js";
import { useTheme } from "../../hooks/useTheme.js";