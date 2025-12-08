import { useState, useEffect } from "react";
import VideoHero from "@/components/custom/VideoHero";
import { Card } from "@/components/ui/card";
import { Building2, Award, Users, Heart, Sparkles, Shield, MapPin } from "lucide-react";
import auroraHCM from "@/assets/images/about/aurora_hochiminh.jpg";
import auroraHanoi from "@/assets/images/about/aurora_hanoi.jpg";
import auroraNhaTrang from "@/assets/images/about/aurora_nhatrang.webp";
import auroraDaNang from "@/assets/images/about/aurora_danang.jpg";

interface TeamMember {
  name: string;
  avatar: string;
  branch: string;
  role: string;
}

const TEAM_MEMBERS = [
  {
    name: "Nguyễn Văn Minh",
    avatar: "https://avatars.githubusercontent.com/u/121565657?v=4"
  },
  {
    name: "Nguyễn Trần Gia Sĩ",
    avatar: "https://avatars.githubusercontent.com/u/63839394?v=4"
  },
  {
    name: "Nguyễn Trung Nguyên",
    avatar: "https://avatars.githubusercontent.com/u/126145466?v=4"
  },
  {
    name: "Nguyễn Duy Khải",
    avatar: "https://avatars.githubusercontent.com/u/155984819?v=4"
  }
];

const BRANCHES = [
  "Hồ Chí Minh",
  "Hà Nội",
  "Nha Trang",
  "Đà Nẵng"
];

const BRANCH_IMAGES = [
  auroraHCM,
  auroraHanoi,
  auroraNhaTrang,
  auroraDaNang
];

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [randomImage, setRandomImage] = useState<string>("");

  useEffect(() => {
    // Random assignment of branches to team members
    const shuffledBranches = shuffleArray(BRANCHES);
    const members: TeamMember[] = TEAM_MEMBERS.map((member, index) => ({
      ...member,
      branch: shuffledBranches[index],
      role: `Giám đốc chi nhánh ${shuffledBranches[index]}`
    }));
    setTeamMembers(members);

    // Random select an image from branch images
    const randomIndex = Math.floor(Math.random() * BRANCH_IMAGES.length);
    setRandomImage(BRANCH_IMAGES[randomIndex]);
  }, []); // Only run once on mount

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <VideoHero 
        title="Về Aurora Hotel"
        subtitle="Câu chuyện về sự sang trọng và phong cách phục vụ tận tâm"
      />

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Aurora Hotel được thành lập vào năm 2010 với tầm nhìn trở thành khách sạn hàng đầu 
                  tại Việt Nam. Chúng tôi tin rằng mỗi chuyến đi đều là một trải nghiệm đáng nhớ, 
                  và sứ mệnh của chúng tôi là tạo ra những kỷ niệm tuyệt vời cho mỗi vị khách.
                </p>
                <p>
                  Với hơn 14 năm kinh nghiệm trong ngành khách sạn, Aurora Hotel đã phục vụ hàng triệu 
                  khách hàng từ khắp nơi trên thế giới. Chúng tôi tự hào về dịch vụ chuyên nghiệp, 
                  cơ sở vật chất hiện đại và đội ngũ nhân viên tận tâm.
                </p>
                <p>
                  Từ việc chào đón khách đến tận cửa cho đến những dịch vụ cao cấp, chúng tôi luôn 
                  đặt sự hài lòng của khách hàng lên hàng đầu.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                {randomImage ? (
                  <img
                    src={randomImage}
                    alt="Aurora Hotel"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                    <Building2 className="h-64 w-64 text-primary/30" />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những nguyên tắc định hướng hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Chất lượng</h3>
              <p className="text-gray-600 leading-relaxed">
                Cam kết cung cấp dịch vụ chất lượng cao nhất trong mọi khía cạnh
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Tận tâm</h3>
              <p className="text-gray-600 leading-relaxed">
                Phục vụ khách hàng với tất cả sự tận tâm và chu đáo
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Đổi mới</h3>
              <p className="text-gray-600 leading-relaxed">
                Không ngừng cải tiến và đổi mới để mang đến trải nghiệm tốt nhất
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Tin cậy</h3>
              <p className="text-gray-600 leading-relaxed">
                Xây dựng lòng tin bền vững với khách hàng và đối tác
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Thành tựu của chúng tôi</h2>
            <p className="text-xl text-gray-600">Những con số ấn tượng về Aurora Hotel</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-5xl font-bold text-primary mb-3">14+</div>
              <div className="text-gray-700 font-medium">Năm kinh nghiệm</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-5xl font-bold text-primary mb-3">250+</div>
              <div className="text-gray-700 font-medium">Phòng nghỉ</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100">
              <div className="text-5xl font-bold text-primary mb-3">50K+</div>
              <div className="text-gray-700 font-medium">Khách hàng hài lòng</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-5xl font-bold text-primary mb-3">98%</div>
              <div className="text-gray-700 font-medium">Đánh giá tích cực</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Đội ngũ lãnh đạo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những người dẫn dắt Aurora Hotel đến thành công với 4 chi nhánh trên toàn quốc
            </p>
          </div>

          {teamMembers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-0 shadow-lg group"
                >
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 shadow-xl">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=128&background=random`;
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {member.branch}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {member.role}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Building2 className="h-4 w-4" />
                      <span>Chi nhánh {member.branch}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {teamMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4 animate-pulse" />
              <p className="text-gray-600">Đang tải thông tin đội ngũ...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
