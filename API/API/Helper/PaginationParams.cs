using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helper
{
    public class PaginationParams
    {
        private const int MazPageZize=50;
        public int pageNumber { get; set; }=1;
        public int MinAge { get; set; }=18;
        public int MaxAge { get; set; }=150;
        private int _pageSize=10;
        public int PageSize
        {
            get=> _pageSize;
            set => _pageSize=(value > MazPageZize)?MazPageZize:value;
        }
    }
}